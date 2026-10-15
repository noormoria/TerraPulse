/* TerraPulse: location-correct, real-time solar illumination for Globe.gl.
   Falls back to the bright daytime map whenever the shader or textures fail. */
import { TextureLoader, ShaderMaterial, Vector2, SRGBColorSpace } from 'https://esm.sh/three@0.179.1';

const TEXTURE_BASE = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/';
const RAD = Math.PI / 180;
const wrapLongitude = degrees => (((degrees % 360) + 540) % 360) - 180;

// Astronomical approximation of the subsolar point, using the real UTC instant.
// Solar longitude is east-positive; solar latitude is the Sun's declination.
export function subsolarPoint(date = new Date()) {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const n = jd - 2451545.0;
  const L = ((280.460 + 0.9856474 * n) % 360 + 360) % 360;
  const g = (357.528 + 0.9856003 * n) * RAD;
  const lambda = (L + 1.915 * Math.sin(g) + .020 * Math.sin(2 * g)) * RAD;
  const epsilon = (23.439 - .0000004 * n) * RAD;
  const rightAscension = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda)) / RAD;
  const declination = Math.asin(Math.sin(epsilon) * Math.sin(lambda)) / RAD;
  const gmst = 280.46061837 + 360.98564736629 * n;
  return {lng: wrapLongitude(rightAscension - gmst), lat: declination};
}

// Globe.gl day-night example's globe/camera orientation, with a brighter night
// floor so countries and oceans remain recognizable after sunset.
const vertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragmentShader = `
  #define PI 3.141592653589793
  uniform sampler2D dayTexture;
  uniform sampler2D nightTexture;
  uniform vec2 sunPosition;
  uniform vec2 globeRotation;
  varying vec3 vNormal;
  varying vec2 vUv;

  float toRad(float a) { return a * PI / 180.0; }
  vec3 polar2Cartesian(vec2 c) { // longitude, latitude
    float theta = toRad(90.0 - c.x);
    float phi = toRad(90.0 - c.y);
    return vec3(sin(phi) * cos(theta), cos(phi), sin(phi) * sin(theta));
  }
  void main() {
    float invLon = toRad(globeRotation.x);
    float invLat = -toRad(globeRotation.y);
    mat3 rotX = mat3(1.0,0.0,0.0, 0.0,cos(invLat),-sin(invLat), 0.0,sin(invLat),cos(invLat));
    mat3 rotY = mat3(cos(invLon),0.0,sin(invLon), 0.0,1.0,0.0, -sin(invLon),0.0,cos(invLon));
    vec3 sunDirection = normalize(rotX * rotY * polar2Cartesian(sunPosition));
    float sunAngle = dot(normalize(vNormal), sunDirection);
    float dayAmount = smoothstep(-0.17, 0.17, sunAngle);
    vec3 dayColor = texture2D(dayTexture, vUv).rgb;
    vec3 cityLights = texture2D(nightTexture, vUv).rgb;
    // Night is intentionally illuminated: cities glow, land remains legible.
    vec3 readableNight = max(dayColor * vec3(0.46, 0.52, 0.65), cityLights * 0.80);
    gl_FragColor = vec4(mix(readableNight, dayColor, dayAmount), 1.0);
  }
`;

export async function startSolarLighting(globe, isCurrent) {
  const loader = new TextureLoader();
  const [dayTexture, nightTexture] = await Promise.all([
    loader.loadAsync(TEXTURE_BASE + 'earth-day.jpg'),
    loader.loadAsync(TEXTURE_BASE + 'earth-night.jpg')
  ]);
  dayTexture.colorSpace = SRGBColorSpace;
  nightTexture.colorSpace = SRGBColorSpace;
  const releaseTextures = () => {dayTexture.dispose(); nightTexture.dispose();};
  if (!isCurrent()) {releaseTextures(); return null;}

  const material = new ShaderMaterial({
    uniforms: {
      dayTexture: {value: dayTexture},
      nightTexture: {value: nightTexture},
      sunPosition: {value: new Vector2()},
      globeRotation: {value: new Vector2()}
    },
    vertexShader, fragmentShader
  });
  const updateSun = () => {
    const sun = subsolarPoint(new Date());
    material.uniforms.sunPosition.value.set(sun.lng, sun.lat);
  };
  // Camera movement and auto rotation both change which hemisphere faces us.
  const updateCamera = ({lng, lat}) => material.uniforms.globeRotation.value.set(lng, lat);
  updateCamera(globe.pointOfView());
  updateSun();
  globe.globeMaterial(material);
  globe.onZoom(updateCamera);
  // Real clock, not a simulated or accelerated day/night animation.
  const interval = setInterval(updateSun, 60_000);
  return () => {
    clearInterval(interval);
    material.dispose();
    releaseTextures();
  };
}