/* TerraPulse 2.0 — story-first geospatial analytics.
   All observations originate from the validated USGS analysis snapshot.
   No synthetic seismic events, prediction or hazard scoring. */
(() => {
  'use strict';
  const doc=document;
  const $=id=>doc.getElementById(id);
  const STR={
    ar:{
      skip:'تخطي إلى الاستكشاف',navExplore:'استكشف الأنماط',navContext:'مقارنة النشاط',navMethod:'كيف نحلل؟',
      eyebrow:'EARTHQUAKE PATTERN INTELLIGENCE',heroLine1:'الزلازل ليست مجرد',heroLine2:'نقاط على خريطة.',
      heroDesc:'اكتشفي أنماط النشاط الزلزالي حول العالم، وميّزي بين التجمعات الجغرافية والتغيرات التاريخية — باستخدام سجلات حقيقية وتحليل قابل للتفسير.',
      heroPrimary:'استكشفي الأنماط',heroSecondary:'كيف يعمل التحليل؟',heroSource:'سجلات USGS الفعلية • بدون تنبؤات أو أحداث مصطنعة',
      heroDataLabel:'سجلات تاريخية',heroEventUnit:'زلزال بقوة 4.5+',heroClusterLabel:'تجمعات مكتشفة',heroVisualCaption:'من بيانات جغرافية إلى قصة قابلة للفهم',
      value1:'بيانات حقيقية من USGS',value2:'تجمعات جغرافية قابلة للتفسير',value3:'مقارنة مع سجل تاريخي',
      sectionOneKicker:'01 / EXPLORE THE PATTERNS',exploreTitle:'أين يتركز النشاط الزلزالي المسجل؟',
      exploreDesc:'اضغطي على إحدى التجمعات لاكتشاف حجم النشاط وخصائصه. هذه مواقع أحداث تاريخية وليست توقعات مستقبلية.',
      basedOn:'مبني على بيانات',m45:'M 4.5+ · 365 يومًا',loading:'جارٍ تحميل التحليل الحقيقي من USGS...',
      statTotal:'إجمالي الزلازل',statTotalSub:'خلال الفترة التاريخية',statClusters:'التجمعات المكتشفة',statPeak:'أعلى قوة مسجلة',magUnit:'Magnitude',
      statUpdated:'تاريخ البيانات',statDateSub:'آخر معالجة مكتملة (UTC)',mapTitle:'خريطة تجمعات الزلازل',
      mapDesc:'حددي أي دائرة لعرض تحليلها. حجم الدائرة يعكس عدد الأحداث في التجمع.',resetView:'العالم كله',
      mapUnavailable:'الخريطة غير متاحة حاليًا؛ تقدرين تختارين أي منطقة من القائمة.',
      legendText:'تجمعات تاريخية من DBSCAN',mapNotForecast:'ليست خريطة خطر أو تنبؤ',
      selectionTitle:'افهمي النمط',selectionSub:'اختاري منطقة من الخريطة أو القائمة',choosePrompt:'اختاري تجمعًا جغرافيًا لعرض الأرقام والتفسير هنا.',
      topClusters:'أبرز التجمعات المسجلة',clusterCountNote:'مرتبة حسب عدد الأحداث',
      sectionTwoKicker:'02 / PUT THE NUMBERS IN CONTEXT',contextTitle:'هل النشاط الأخير مختلف عن المعتاد؟',
      contextDesc:'نقارن عدد الأحداث العالمية المسجلة خلال 7 أيام مع التوزيع التاريخي للأسابيع السابقة. المقارنة وصفية وليست تحذيرًا.',
      contextQuestion:'السؤال: كيف يبدو الأسبوع الحالي أمام الأسابيع السابقة؟',events7d:'زلزال مسجل خلال آخر 7 أيام مكتملة',
      waiting:'جارٍ حساب المقارنة...',contextCaution:'هذه المقارنة تصف النشاط المرصود عالميًا، ولا تعني توقع وقوع زلازل.',
      medianLabel:'الوسيط الأسبوعي التاريخي',p90Label:'المئين التسعون للأسبوع',
      trendTitle:'النشاط خلال آخر 30 يومًا',trendDesc:'عدد أحداث M4.5+ يوميًا من آخر سجل مكتمل',
      trendStart:'الأقدم',trendEnd:'الأحدث',
      sectionThreeKicker:'03 / THE SCIENCE BEHIND THE STORY',methodTitle:'كيف تتحول البيانات إلى فهم؟',
      methodIntro:'كل مؤشر قابل للتفسير والتحقق. لا نخلط بين تجمعات الزلازل التاريخية واحتمال حدوث زلزال مستقبلي.',
      method1:'جمع البيانات',method1Desc:'سجلات أحداث الزلازل من USGS FDSN Earthquake Catalog بقوة 4.5 فأكثر.',
      method2:'تنظيف البيانات',method2Desc:'فحص القيم المفقودة، المعرّفات المكررة، الإحداثيات والتواريخ.',
      method3:'اكتشاف التجمعات',method3Desc:'DBSCAN مع مسافة Haversine للكشف عن التقارب الجغرافي للأحداث التاريخية.',
      method4:'وضعها في سياق',method4Desc:'مقارنة نشاط آخر 7 أيام مع 52 أسبوعًا سابقًا، مع توضيح حدود الاستنتاج.',
      transparentTitle:'البيانات قبل الادعاءات.',transparentDesc:'يُحدّث التحليل آليًا عند نجاح معالجة السجلات. المصدر مستقل، والنتائج تعليمية وليست إنذارًا أو توقعًا.',
      downloadCSV:'تحميل Dataset · CSV',sourceLink:'مصدر البيانات: USGS',
      footerText:'منصة مستقلة لتحليل سجلات الزلازل — ليست نظام تنبؤ أو إنذار.',
      loaded:'تم تحميل التحليل من سجلات USGS',failed:'تعذّر تحميل البيانات الحقيقية. لن نعرض أرقامًا افتراضية.',
      selectedRegion:'تجمع جغرافي تاريخي',examplePlace:'نموذج لموقع مسجل لدى USGS',
      events:'عدد الزلازل',average:'متوسط القوة',maximum:'أقصى قوة',depth:'متوسط العمق',depthUnit:'كم',
      clusterNote:'هذه الأحداث متقاربة جغرافيًا وفق DBSCAN؛ لا يعني التجمع ارتفاع الخطر المستقبلي.',
      fraction:'من إجمالي السجلات في الفترة',
      statusHigher:'عدد الأحداث أعلى من المئين التسعين التاريخي',statusLower:'عدد الأحداث أقل من الوسيط الأسبوعي التاريخي',
      statusMiddle:'عدد الأحداث بين الوسيط والمئين التسعين التاريخي',
      explanationHigher:'المقارنة وصفية على مستوى العالم. تجاوز المستوى التاريخي لا يمثل إنذارًا أو تنبؤًا بالزلازل.',
      explanationLower:'العدد أقل من الوسيط التاريخي للأسابيع المقارنة. لا يعني ذلك تقييمًا للسلامة أو توقعًا للمستقبل.',
      explanationMiddle:'العدد بين الوسيط والمئين التسعين تاريخيًا. لا يعني ذلك تقييمًا للسلامة أو توقعًا للمستقبل.',
      period:'الفترة التاريخية',until:'حتى (غير شامل)',clusterShort:'زلزال',lastComplete:'آخر يوم مكتمل',
      errorChart:'لا توجد بيانات رسم بياني حالية.',shownTop:'من أبرز التجمعات فقط',areaPlaceholder:'موقع تقريبي للتجمع'
    },
    en:{
      skip:'Skip to explorer',navExplore:'Explore patterns',navContext:'Activity context',navMethod:'Our method',
      eyebrow:'EARTHQUAKE PATTERN INTELLIGENCE',heroLine1:'Earthquakes are more than',heroLine2:'dots on a map.',
      heroDesc:'Understand where recorded earthquakes concentrate and how global activity changes over time, using real observations and interpretable geospatial analysis.',
      heroPrimary:'Explore patterns',heroSecondary:'How the analysis works',heroSource:'Verified USGS records · No invented events or predictions',
      heroDataLabel:'Historical records',heroEventUnit:'earthquakes M4.5+',heroClusterLabel:'Detected clusters',heroVisualCaption:'From geospatial records to understandable stories',
      value1:'Real USGS observations',value2:'Interpretable geographic clustering',value3:'Historical activity context',
      sectionOneKicker:'01 / EXPLORE THE PATTERNS',exploreTitle:'Where does recorded seismic activity cluster?',
      exploreDesc:'Select a cluster to examine its characteristics. These are historical concentrations — not forecasts.',
      basedOn:'Based on records',m45:'M 4.5+ · 365 days',loading:'Loading the real USGS analysis...',
      statTotal:'Recorded earthquakes',statTotalSub:'In the historical window',statClusters:'Detected clusters',statPeak:'Maximum magnitude',magUnit:'Magnitude',
      statUpdated:'Catalog date',statDateSub:'Last complete UTC day',mapTitle:'Historical cluster map',
      mapDesc:'Choose a circle to see its evidence. Circle size reflects events in the cluster.',resetView:'Whole world',
      mapUnavailable:'Map imagery is unavailable. Select a cluster from the accessible list instead.',
      legendText:'Historical DBSCAN clusters',mapNotForecast:'Not a risk or prediction map',
      selectionTitle:'Understand the pattern',selectionSub:'Choose a cluster on the map or in the list',
      choosePrompt:'Select a geographic cluster to view its measurements and interpretation.',
      topClusters:'Largest recorded clusters',clusterCountNote:'Ordered by event count',
      sectionTwoKicker:'02 / PUT THE NUMBERS IN CONTEXT',contextTitle:'How unusual is recent global activity?',
      contextDesc:'Compare the latest complete 7 days with a distribution of preceding weekly counts. This is descriptive, not an alert.',
      contextQuestion:'How does the most recent week compare with history?',events7d:'recorded earthquakes in the latest 7 full days',
      waiting:'Calculating the comparison...',contextCaution:'This comparison describes observed global activity; it does not predict earthquakes.',
      medianLabel:'Historical weekly median',p90Label:'Historical weekly 90th percentile',
      trendTitle:'Recent daily activity',trendDesc:'Counts of M4.5+ earthquakes, using complete UTC dates',
      trendStart:'Earlier',trendEnd:'More recent',
      sectionThreeKicker:'03 / THE SCIENCE BEHIND THE STORY',methodTitle:'How do data become insight?',
      methodIntro:'Each measure has a clear method and limitation. Historical clustering does not imply future earthquake probability.',
      method1:'Collect',method1Desc:'M4.5+ earthquake observations from the USGS FDSN Earthquake Catalog.',
      method2:'Clean',method2Desc:'Validate missing values, duplicate event IDs, coordinates and timestamps.',
      method3:'Find clusters',method3Desc:'DBSCAN with Haversine distance groups geographically close historical events.',
      method4:'Add context',method4Desc:'Compare the last complete 7 days with 52 previous weekly windows, noting the limits.',
      transparentTitle:'Evidence before claims.',transparentDesc:'The snapshot is automatically rebuilt after successful data processing. Results are educational, not warnings or predictions.',
      downloadCSV:'Download dataset · CSV',sourceLink:'Data source: USGS',
      footerText:'Independent earthquake-record analysis — not a prediction or warning service.',
      loaded:'USGS historical analysis loaded',failed:'Real data unavailable. Placeholder figures will not be shown.',
      selectedRegion:'Historical geographic cluster',examplePlace:'Example location reported by USGS',
      events:'Recorded events',average:'Mean magnitude',maximum:'Max magnitude',depth:'Mean depth',depthUnit:'km',
      clusterNote:'DBSCAN groups nearby historical events. A cluster is not evidence of higher future hazard.',
      fraction:'of events in the current catalog',statusHigher:'Count above the historical 90th percentile',
      statusLower:'Count below the historical weekly median',statusMiddle:'Count between the historical median and 90th percentile',
      explanationHigher:'This is a global descriptive comparison. Exceeding a historical threshold is not an earthquake warning or forecast.',
      explanationLower:'The observed count is below the median of the comparison weeks. It is not a safety assessment or future forecast.',
      explanationMiddle:'The count lies between the historical median and 90th percentile. It is not a safety assessment or future forecast.',
      period:'Catalog window',until:'to (exclusive)',clusterShort:'events',lastComplete:'Last full date',errorChart:'Current chart data are unavailable.',
      shownTop:'Showing selected largest clusters',areaPlaceholder:'Approximate cluster position'
    }
  };
  let lang='ar';let theme='dark';let report=null;let selected=-1;let map=null;let tileLayer=null;let pins=[];
  try{lang=localStorage.getItem('tp2-lang')==='en'?'en':'ar';theme=localStorage.getItem('tp2-theme')==='light'?'light':'dark';}catch{}
  const t=key=>STR[lang][key]||STR.en[key]||key;
  const number=(value,digits=0)=>Number.isFinite(Number(value))?new Intl.NumberFormat(lang==='ar'?'ar-SA-u-nu-latn':'en-US',{maximumFractionDigits:digits,minimumFractionDigits:digits}).format(value):'—';
  const dateStr=date=>{
    const d=new Date(date);if(!Number.isFinite(d.getTime()))return '—';
    return new Intl.DateTimeFormat(lang==='ar'?'ar-SA-u-ca-gregory':'en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(d);
  };
  const node=(tag,cls,txt)=>{
    const v=doc.createElement(tag);if(cls)v.className=cls;if(txt!==undefined)v.textContent=txt;return v;
  };
  const setText=(id,value)=>{const el=$(id);if(el)el.textContent=value;};
  function translate(){
    doc.documentElement.lang=lang;doc.documentElement.dir=lang==='ar'?'rtl':'ltr';doc.body.dataset.theme=theme;
    doc.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n)});
    $('langToggle').textContent=lang==='ar'?'EN':'عربي';
    $('themeToggle').setAttribute('aria-label',theme==='dark'?'Switch to light mode':'Switch to dark mode');
    if(report){renderNumbers();renderList();renderSelected();renderContext();renderChart();}
  }
  function safeSnapshot(data){
    if(!data||data.version!==1||data.status!=='ready')throw new Error('Snapshot not ready');
    if(!data.summary||!Number.isFinite(data.summary.total_events)||!data.methodology)throw new Error('Summary missing');
    if(!data.spatial||!Array.isArray(data.spatial.hotspots)||!Number.isFinite(data.spatial.cluster_count))throw new Error('Spatial data missing');
    if(!data.weekly_baseline||!Number.isFinite(data.weekly_baseline.recent_7d)||!Array.isArray(data.daily_last_30d))throw new Error('Time series missing');
    return data;
  }
  function renderNumbers(){
    const summary=report.summary;
    setText('statTotal',number(summary.total_events));setText('statClusters',number(report.spatial.cluster_count));
    setText('statPeak',number(summary.max_magnitude,1));const end=new Date(report.methodology.end_exclusive_utc+'T00:00:00Z');setText('statDate',dateStr(new Date(end.getTime()-86400000)));
    setText('heroTotal',number(summary.total_events));setText('heroClusters',number(report.spatial.cluster_count));
    setText('dataPeriod',t('period')+': '+report.methodology.start_utc+' → '+report.methodology.end_exclusive_utc+' ('+t('until')+', UTC) · '+t('shownTop'));
  }
  function clusterLabel(c){
    // A modal USGS example place describes the cluster, not the exact centroid.
    return String(c.example_place||'').trim()||t('areaPlaceholder');
  }
  function renderList(){
    const host=$('clusterList');host.replaceChildren();
    report.spatial.hotspots.forEach((c,index)=>{
      const button=node('button','cluster-item'+(index===selected?' selected':''));button.type='button';
      button.setAttribute('aria-pressed',String(index===selected));
      button.setAttribute('aria-label',clusterLabel(c)+' '+number(c.count)+' '+t('events'));
      const rank=node('span','cluster-rank',String(index+1).padStart(2,'0'));
      const title=node('span','cluster-item-title');
      title.append(node('strong','',clusterLabel(c)),node('small','',t('examplePlace')));
      const count=node('span','cluster-item-amount',number(c.count));
      button.append(rank,title,count);
      button.addEventListener('click',()=>choose(index,true));
      host.append(button);
    });
  }
  function renderSelected(){
    const host=$('clusterInsight');host.replaceChildren();
    if(selected<0||!report.spatial.hotspots[selected]){
      host.append(node('p','empty-insight',t('choosePrompt')));return;
    }
    const c=report.spatial.hotspots[selected];
    host.append(node('p','cluster-location',t('selectedRegion')+' · '+t('examplePlace')));
    host.append(node('h3','cluster-title',clusterLabel(c)));
    const grid=node('div','cluster-details');
    const cells=[
      [t('events'),number(c.count)],[t('average'),number(c.mean_magnitude,2)],
      [t('maximum'),number(c.max_magnitude,1)],[t('depth'),number(c.mean_depth_km,1)+' '+t('depthUnit')]
    ];
    for(const [name,value] of cells){
      const cell=node('div');cell.append(node('small','',name),node('strong','',value));grid.append(cell);
    }
    host.append(grid);
    const percent=report.summary.total_events>0?(100*c.count/report.summary.total_events).toFixed(1):'0';
    host.append(node('p','cluster-note',percent+'% '+t('fraction')+'. '+t('clusterNote')));
  }
  function choose(index,focus){
    if(!report||!report.spatial.hotspots[index])return;
    selected=index;renderList();renderSelected();
    if(map&&pins[index]){
      pins.forEach((v,i)=>{v.setIcon(makeIcon(report.spatial.hotspots[i],i===index));v.setZIndexOffset(i===index?400:0)});
      if(focus){const c=report.spatial.hotspots[index];map.setView([c.latitude,c.longitude],Math.max(map.getZoom(),4),{animate:true});}
    }
    if(focus&&window.matchMedia('(max-width:810px)').matches){
      const panel=$('clusterInsight');panel.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  }
  function makeIcon(c,active){
    const diameter=Math.min(57,Math.max(30,25+8*Math.sqrt(c.count/90)));
    const textValue=number(c.count);
    const div='<span class="pattern-pin'+(active?' is-active':'')+'" style="width:'+diameter+'px;height:'+diameter+'px">'+textValue+'</span>';
    return L.divIcon({html:div,className:'cluster-marker',iconSize:[diameter,diameter],iconAnchor:[diameter/2,diameter/2]});
  }
  function tileSource(){
    const mode=theme==='light'?'light_all':'dark_all';
    return 'https://{s}.basemaps.cartocdn.com/'+mode+'/{z}/{x}/{y}{r}.png';
  }
  function initMap(){
    if(!window.L||!report.spatial.hotspots.length){$('mapFallback').hidden=false;return;}
    try{
      map=L.map('patternMap',{center:[8,15],zoom:2,minZoom:1,maxZoom:7,scrollWheelZoom:false,worldCopyJump:true});
      tileLayer=L.tileLayer(tileSource(),{attribution:'&copy; OpenStreetMap contributors &copy; CARTO',maxZoom:18,subdomains:'abcd'}).addTo(map);
      pins=report.spatial.hotspots.map((c,i)=>{
        const point=L.marker([c.latitude,c.longitude],{icon:makeIcon(c,i===selected),keyboard:true,title:clusterLabel(c)}).addTo(map);
        point.on('click',()=>choose(i,false));return point;
      });
      setTimeout(()=>map&&map.invalidateSize(),300);
    }catch(e){console.warn('Map unavailable',e);$('mapFallback').hidden=false;}
  }
  function renderContext(){
    const w=report.weekly_baseline;setText('weeklyRecent',number(w.recent_7d));
    setText('weeklyMedian',number(w.baseline_median_7d,1));setText('weeklyP90',number(w.baseline_p90_7d,1));
    const status=$('contextStatus');status.classList.remove('warn');
    let headline,explanation;
    if(w.recent_7d>w.baseline_p90_7d){headline='statusHigher';explanation='explanationHigher';status.classList.add('warn');}
    else if(w.recent_7d<w.baseline_median_7d){headline='statusLower';explanation='explanationLower';}
    else {headline='statusMiddle';explanation='explanationMiddle';}
    status.textContent=t(headline);setText('contextExplanation',t(explanation));
  }
  function renderChart(){
    const host=$('trendChart');host.replaceChildren();
    const cutoff=report.methodology.end_exclusive_utc;
    const records=report.daily_last_30d.filter(o=>o.date<cutoff&&Number.isFinite(o.count)).slice(-30);
    if(records.length<2){host.append(node('p','empty-insight',t('errorChart')));return;}
    const w=650,h=240,pX=24,pY=25,bottom=h-27;
    const max=Math.max(1,...records.map(o=>o.count));
    const step=(w-pX*2)/(records.length-1);
    const points=records.map((o,i)=>({x:pX+i*step,y:bottom-o.count/max*(bottom-pY),date:o.date,value:o.count}));
    const path=points.map((p,i)=>(i?'L':'M')+p.x.toFixed(2)+','+p.y.toFixed(2)).join(' ');
    const fill=path+' L'+points[points.length-1].x.toFixed(2)+','+bottom+' L'+pX+','+bottom+' Z';
    const ns='http://www.w3.org/2000/svg';
    const svg=doc.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 '+w+' '+h);svg.setAttribute('role','img');svg.setAttribute('aria-label',t('trendTitle'));
    const defs=doc.createElementNS(ns,'defs');const grad=doc.createElementNS(ns,'linearGradient');grad.id='patternFill';grad.setAttribute('x1','0');grad.setAttribute('y1','0');grad.setAttribute('x2','0');grad.setAttribute('y2','1');
    for(const [offset,opacity] of [['0%','0.3'],['100%','0.01']]){
      const stop=doc.createElementNS(ns,'stop');stop.setAttribute('offset',offset);stop.setAttribute('stop-color','#6ce6dc');stop.setAttribute('stop-opacity',opacity);grad.append(stop);
    }
    defs.append(grad);svg.append(defs);
    for(const fraction of [0,.5,1]){
      const y=bottom-fraction*(bottom-pY);
      const line=doc.createElementNS(ns,'line');
      for(const [k,v] of Object.entries({x1:pX,y1:y,x2:w-pX,y2:y,stroke:'rgba(146,190,209,.18)','stroke-dasharray':'3 6'}))line.setAttribute(k,v);
      svg.append(line);
      const label=doc.createElementNS(ns,'text');label.setAttribute('x','2');label.setAttribute('y',String(y+3));label.setAttribute('fill','currentColor');label.setAttribute('font-size','10');label.textContent=String(Math.round(max*fraction));svg.append(label);
    }
    const shade=doc.createElementNS(ns,'path');shade.setAttribute('d',fill);shade.setAttribute('fill','url(#patternFill)');svg.append(shade);
    const stroke=doc.createElementNS(ns,'path');stroke.setAttribute('d',path);stroke.setAttribute('fill','none');stroke.setAttribute('stroke','#69e6dc');stroke.setAttribute('stroke-width','3');stroke.setAttribute('stroke-linecap','round');stroke.setAttribute('stroke-linejoin','round');svg.append(stroke);
    points.forEach((p,i)=>{
      if(i%4!==0&&i!==points.length-1)return;
      const c=doc.createElementNS(ns,'circle');c.setAttribute('cx',String(p.x));c.setAttribute('cy',String(p.y));c.setAttribute('r','4');c.setAttribute('fill','#bdfcf4');c.setAttribute('stroke','#0e3442');c.setAttribute('stroke-width','2');
      const title=doc.createElementNS(ns,'title');title.textContent=p.date+': '+p.value+' '+t('events');c.append(title);svg.append(c);
    });
    host.append(svg);
  }
  async function load(){
    try{
      const response=await fetch('data/insights.json?stamp='+Date.now(),{cache:'no-store'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      report=safeSnapshot(await response.json());
      renderNumbers();renderList();renderSelected();renderContext();renderChart();
      initMap();if(report.spatial.hotspots.length)choose(0,false);
      const notice=$('dataNotice');notice.classList.add('ok');notice.querySelector('span:last-child').textContent=t('loaded')+' · '+dateStr(report.generated_at_utc);
    }catch(error){
      console.warn('TerraPulse 2.0 could not load verified analysis:',error);
      const notice=$('dataNotice');notice.classList.add('error');notice.querySelector('span:last-child').textContent=t('failed');
      $('clusterList').replaceChildren(node('p','list-loading',t('failed')));
      $('trendChart').replaceChildren(node('p','empty-insight',t('errorChart')));
    }
  }
  $('langToggle').addEventListener('click',()=>{
    lang=lang==='ar'?'en':'ar';try{localStorage.setItem('tp2-lang',lang)}catch{}
    translate();
    if(report){const notice=$('dataNotice');notice.querySelector('span:last-child').textContent=t('loaded')+' · '+dateStr(report.generated_at_utc);}
  });
  $('themeToggle').addEventListener('click',()=>{
    theme=theme==='dark'?'light':'dark';try{localStorage.setItem('tp2-theme',theme)}catch{}
    translate();if(tileLayer)tileLayer.setUrl(tileSource());
  });
  $('resetMap').addEventListener('click',()=>{
    if(map){map.setView([8,15],2,{animate:true});}
  });
  setText('year',new Date().getFullYear());
  translate();
  load();
})();