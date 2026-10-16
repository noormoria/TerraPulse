/* Country-aware earthquake labels. Natural Earth simplified boundaries from world-atlas.
   Offshore events remain USGS-reported regions: NEVER assume the nearest country. */
(() => {
  'use strict';
  let polygons=[];
  let ready=false;
  const lookupCache=new Map();
  function area(place) {
    const s=String(place||'').trim()||'Unspecified region';
    if(s.includes(','))return s.split(',').pop().trim();
    const match=s.match(/\b(?:of|near)\s+(.+)$/i);
    return (match?match[1]:s).trim().slice(0,72);
  }
  function ringBounds(ring) {
    let minX=180,maxX=-180,minY=90,maxY=-90;
    for(const p of ring){if(p[0]<minX)minX=p[0];if(p[0]>maxX)maxX=p[0];if(p[1]<minY)minY=p[1];if(p[1]>maxY)maxY=p[1];}
    return {minX,maxX,minY,maxY};
  }
  function withinRing(lng,lat,ring) {
    let inside=false;
    for(let i=0,j=ring.length-1;i<ring.length;j=i++){
      let ax=ring[i][0],ay=ring[i][1],bx=ring[j][0],by=ring[j][1];
      // Shift points of a dateline-crossing polygon close to the test longitude.
      while(ax-lng>180)ax-=360;while(ax-lng< -180)ax+=360;
      while(bx-lng>180)bx-=360;while(bx-lng< -180)bx+=360;
      if((ay>lat)!==(by>lat)&&lng<(bx-ax)*(lat-ay)/(by-ay)+ax)inside=!inside;
    }
    return inside;
  }
  function inCountry(lng,lat,p) {
    const b=p.bounds;
    if(lat<b.minY||lat>b.maxY)return false;
    if(b.maxX-b.minX<180&&(lng<b.minX||lng>b.maxX))return false;
    if(!withinRing(lng,lat,p.rings[0]))return false;
    for(let i=1;i<p.rings.length;i++)if(withinRing(lng,lat,p.rings[i]))return false;
    return true;
  }
  function label(record,lang) {
    if(!record)return '';
    if(record.kind!=='country')return record.name;
    try {
      const display=new Intl.DisplayNames([lang==='ar'?'ar':'en'],{type:'region'});
      const translated=display.of(record.code);
      return translated&&translated!==record.code?translated:record.name;
    }catch{return record.name;}
  }
  function locate(e){
    const cacheKey=e.lat.toFixed(4)+'/'+e.lng.toFixed(4);
    if(lookupCache.has(cacheKey))return lookupCache.get(cacheKey);
    if(ready){
      for(const p of polygons){
        if(inCountry(e.lng,e.lat,p)){
          const found={key:'country:'+p.code,kind:'country',name:p.name,code:p.code};
          lookupCache.set(cacheKey,found);return found;
        }
      }
    }
    const name=area(e.place);
    const fallback={key:'region:'+name.toLowerCase(),kind:'region',name,code:null};
    lookupCache.set(cacheKey,fallback);
    return fallback;
  }
  async function load() {
    if(!window.topojson||typeof window.topojson.feature!=='function')return false;
    try {
      const response=await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',{cache:'force-cache'});
      if(!response.ok)throw new Error('Country boundaries unavailable');
      const topology=await response.json();
      const features=window.topojson.feature(topology,topology.objects.countries).features;
      const next=[];
      for(const feature of features){
        const geo=feature.geometry;
        if(!geo)continue;
        const groups=geo.type==='Polygon'?[geo.coordinates]:geo.type==='MultiPolygon'?geo.coordinates:[];
        for(const rings of groups){
          if(!rings.length||!rings[0].length)continue;
          next.push({rings,bounds:ringBounds(rings[0]),code:String(feature.id).padStart(3,'0'),name:feature.properties?.name||'Country'});
        }
      }
      polygons=next;
      ready=true;
      lookupCache.clear();
      return true;
    }catch(err){console.warn('Country boundary lookup unavailable; showing original USGS areas.',err);return false;}
  }
  window.TerraRegions={load,locate,label,get ready(){return ready;}};
})();