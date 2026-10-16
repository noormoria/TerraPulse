/* Country-aware earthquake labels. Natural Earth simplified boundaries from world-atlas.
   Offshore events remain USGS-reported regions: NEVER assume the nearest country. */
(() => {
  'use strict';
  let polygons=[];
  let ready=false;
  const lookupCache=new Map();
  const alphaByNumeric=Object.fromEntries('533:AW 004:AF 024:AO 660:AI 248:AX 008:AL 020:AD 784:AE 032:AR 051:AM 016:AS 010:AQ 260:TF 028:AG 036:AU 040:AT 031:AZ 108:BI 056:BE 204:BJ 535:BQ 854:BF 050:BD 100:BG 048:BH 044:BS 070:BA 652:BL 112:BY 084:BZ 060:BM 068:BO 076:BR 052:BB 096:BN 064:BT 074:BV 072:BW 140:CF 124:CA 166:CC 756:CH 152:CL 156:CN 384:CI 120:CM 180:CD 178:CG 184:CK 170:CO 174:KM 132:CV 188:CR 192:CU 531:CW 162:CX 136:KY 196:CY 203:CZ 276:DE 262:DJ 212:DM 208:DK 214:DO 012:DZ 218:EC 818:EG 232:ER 732:EH 724:ES 233:EE 231:ET 246:FI 242:FJ 238:FK 250:FR 234:FO 583:FM 266:GA 826:GB 268:GE 831:GG 288:GH 292:GI 324:GN 312:GP 270:GM 624:GW 226:GQ 300:GR 308:GD 304:GL 320:GT 254:GF 316:GU 328:GY 344:HK 334:HM 340:HN 191:HR 332:HT 348:HU 360:ID 833:IM 356:IN 086:IO 372:IE 364:IR 368:IQ 352:IS 376:IL 380:IT 388:JM 832:JE 400:JO 392:JP 398:KZ 404:KE 417:KG 116:KH 296:KI 659:KN 410:KR 414:KW 418:LA 422:LB 430:LR 434:LY 662:LC 438:LI 144:LK 426:LS 440:LT 442:LU 428:LV 446:MO 663:MF 504:MA 492:MC 498:MD 450:MG 462:MV 484:MX 584:MH 807:MK 466:ML 470:MT 104:MM 499:ME 496:MN 580:MP 508:MZ 478:MR 500:MS 474:MQ 480:MU 454:MW 458:MY 175:YT 516:NA 540:NC 562:NE 574:NF 566:NG 558:NI 570:NU 528:NL 578:NO 524:NP 520:NR 554:NZ 512:OM 586:PK 591:PA 612:PN 604:PE 608:PH 585:PW 598:PG 616:PL 630:PR 408:KP 620:PT 600:PY 275:PS 258:PF 634:QA 638:RE 642:RO 643:RU 646:RW 682:SA 729:SD 686:SN 702:SG 239:GS 654:SH 744:SJ 090:SB 694:SL 222:SV 674:SM 706:SO 666:PM 688:RS 728:SS 678:ST 740:SR 703:SK 705:SI 752:SE 748:SZ 534:SX 690:SC 760:SY 796:TC 148:TD 768:TG 764:TH 762:TJ 772:TK 795:TM 626:TL 776:TO 780:TT 788:TN 792:TR 798:TV 158:TW 834:TZ 800:UG 804:UA 581:UM 858:UY 840:US 860:UZ 336:VA 670:VC 862:VE 092:VG 850:VI 704:VN 548:VU 876:WF 882:WS 887:YE 710:ZA 894:ZM 716:ZW'.split(' ').map(p=>p.split(':')));
  function area(place) {
    const s=String(place||'').trim()||'Unspecified region';
    if(/^offshore\b/i.test(s)||/^near the coast\b/i.test(s))return s.slice(0,72);
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
      const translated=display.of(alphaByNumeric[record.code]||record.code);
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