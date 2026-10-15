/* TerraPulse · Historical Data Intelligence
   No data is invented. Data appears only after USGS Python pipeline succeeds. */
(() => {
  'use strict';
  const $ = q => document.querySelector(q);
  const $$ = q => [...document.querySelectorAll(q)];
  const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dict = {
    en: {
      workspace:'WORKSPACE',overview:'Overview',explorer:'Live Explorer',analytics:'Analytics',compare:'Compare',reports:'Reports',intelligence:'Data Intelligence',
      catalog:'USGS historical catalog',notPredictions:'Observed data, not earthquake forecasts.',source:'Data source',platform:'Platform',
      eyebrow:'GEOSPATIAL DATA SCIENCE',title:'Data Intelligence',intro:'Explore historical earthquake data, geographic clusters and activity benchmarks built with Python.',
      heroTitle:'From raw observations to explainable insights',heroText:'Every figure comes from USGS records. No synthetic events, predicted earthquakes or fabricated alerts.',
      seeCode:'View Python pipeline',loading:'Loading real historical analysis…',
      trendTitle:'30-day activity trend',trendDesc:'Recorded M4.5+ earthquakes per complete UTC day',distTitle:'Magnitude distribution',distDesc:'Distribution within the 365-day catalog',
      clustersTitle:'Geographic clusters',clustersDesc:'DBSCAN · geographic distance · not a hazard prediction',
      scatterNote:'Each marker shows the approximate geographic center of a cluster; its size represents observed earthquakes in the group.',
      topClusters:'Largest observed groups',topClustersDesc:'Select a group to highlight its location',
      benchmarkTitle:'Unusual activity benchmark',benchmarkDesc:'Recent 7 full days vs the preceding 52 complete weeks',
      methodTitle:'Transparent methodology',methodDesc:'What was calculated and what it does not mean',
      datasetLabel:'Dataset',cleanupLabel:'Preprocessing',cleanup:'Missing-value checks, duplicate IDs and coordinate validation',
      algoLabel:'Clustering',anomalyLabel:'Activity comparison',anomalyMethod:'7-day count vs historical 90th percentile (52 weeks)',
      caution:'Clusters are historical concentrations, not predictions. Above-baseline activity is a descriptive comparison, not a safety warning.',
      getDataset:'Download historical dataset (CSV)',getAnalysis:'Download analysis (JSON)',footer:'Independent educational data science project',
      events:'Observed events',meanMag:'Mean magnitude',maxMag:'Maximum magnitude',medianDepth:'Median depth',eventsNote:'M4.5+ · last 365 days',
      meanNote:'Recorded earthquake magnitudes',maxNote:'Largest recorded magnitude',depthNote:'Kilometers · observed records',
      range:'Historical catalog period',asOf:'Last data update',
      weeklyLast:'Last 7 days',weeklyMedian:'Historical median',weeklyP90:'Historical 90th percentile',
      unusual:'Above the historical 90th percentile for weekly counts. This is not a hazard warning.',
      typical:'Within the historical 90th percentile for weekly counts. This is not a safety assessment.',
      group:'Group',eventsCount:'events',mean:'Mean magnitude',depth:'Mean depth',km:'km',unclassified:'Unclustered points',
      loadingError:'The historical dataset is not published yet or could not be loaded. The real-data workflow needs to finish successfully before these charts appear.',
      pending:'Historical analysis has not been generated yet. In GitHub, open Actions → Update TerraPulse historical intelligence → Run workflow. When it finishes, reload this page.',
      viewActions:'Open GitHub Actions',retry:'Try again',noClusters:'The current dataset contains no groups matching the clustering parameters.',
      longitude:'Longitude',latitude:'Latitude',count:'Count',week:'Week',date:'Date',
    },
    ar: {
      workspace:'مساحة العمل',overview:'نظرة عامة',explorer:'استكشاف مباشر',analytics:'التحليلات',compare:'المقارنة',reports:'التقارير',intelligence:'ذكاء البيانات',
      catalog:'السجل التاريخي من USGS',notPredictions:'بيانات مسجلة وليست توقعات زلازل.',source:'مصدر البيانات',platform:'المنصة',
      eyebrow:'علم البيانات الجغرافية',title:'ذكاء البيانات',intro:'استكشفي بيانات الزلازل التاريخية والتجمعات الجغرافية ومقارنات النشاط باستخدام Python.',
      heroTitle:'من البيانات الخام إلى نتائج قابلة للتفسير',heroText:'كل رقم مشتق من سجلات USGS الحقيقية، دون أحداث وهمية أو تنبؤات بوقوع زلازل أو تنبيهات مختلقة.',
      seeCode:'اطلعي على كود Python',loading:'جارٍ تحميل التحليل التاريخي الحقيقي…',
      trendTitle:'اتجاه النشاط خلال 30 يومًا',trendDesc:'عدد الزلازل المسجلة بقوة 4.5 فأكثر لكل يوم UTC مكتمل',
      distTitle:'توزيع قوة الزلازل',distDesc:'توزيع قيم القوة خلال آخر 365 يومًا',
      clustersTitle:'التجمعات الجغرافية',clustersDesc:'DBSCAN · المسافة الجغرافية · ليس تنبؤًا بالخطر',
      scatterNote:'كل علامة تمثل المركز التقريبي لتجمع جغرافي، ويعكس حجمها عدد الزلازل المسجلة ضمنه.',
      topClusters:'أكبر التجمعات المسجلة',topClustersDesc:'اختاري تجمعًا لتحديد موقعه على الرسم',
      benchmarkTitle:'مقارنة النشاط غير المعتاد',benchmarkDesc:'آخر 7 أيام مكتملة مقارنة بالأسابيع الـ52 السابقة',
      methodTitle:'منهجية تحليل شفافة',methodDesc:'ما الذي حُسب وما الذي لا تعنيه النتائج',
      datasetLabel:'مجموعة البيانات',cleanupLabel:'معالجة البيانات',cleanup:'معالجة القيم المفقودة وحذف المعرّفات المكررة والتحقق من الإحداثيات',
      algoLabel:'التجميع',anomalyLabel:'مقارنة النشاط',anomalyMethod:'عدد 7 أيام مقابل المئين التسعين خلال 52 أسبوعًا',
      caution:'التجمعات تصف مواقع تاريخية وليست تنبؤات. تجاوز النشاط المستوى التاريخي مجرد مقارنة وصفية، وليس تحذيرًا من الخطر.',
      getDataset:'تنزيل مجموعة البيانات التاريخية CSV',getAnalysis:'تنزيل نتائج التحليل JSON',footer:'مشروع تعليمي مستقل في علم البيانات',
      events:'الأحداث المسجلة',meanMag:'متوسط القوة',maxMag:'أعلى قوة',medianDepth:'وسيط العمق',eventsNote:'قوة 4.5+ خلال آخر 365 يومًا',
      meanNote:'متوسط قوى الزلازل المسجلة',maxNote:'أكبر قوة مسجلة',depthNote:'بالكيلومتر حسب السجل',
      range:'الفترة التاريخية',asOf:'آخر تحديث للبيانات',
      weeklyLast:'آخر 7 أيام',weeklyMedian:'الوسيط التاريخي',weeklyP90:'المئين التسعون تاريخيًا',
      unusual:'عدد الزلازل أعلى من المئين التسعين للأسابيع السابقة. هذا ليس تحذيرًا من الزلازل.',
      typical:'عدد الزلازل لا يتجاوز المئين التسعين تاريخيًا. هذا لا يعني تقييمًا للسلامة.',
      group:'تجمع',eventsCount:'زلزالًا',mean:'متوسط القوة',depth:'متوسط العمق',km:'كم',unclassified:'نقاط غير مصنفة ضمن تجمع',
      loadingError:'لم يتم نشر مجموعة البيانات التاريخية بعد، أو تعذر تحميلها. يجب أن يكتمل تشغيل التحليل الفعلي قبل عرض الرسوم.',
      pending:'لم يُنشأ التحليل التاريخي بعد. افتحي GitHub ← Actions ← Update TerraPulse historical intelligence ← Run workflow، ثم حدّثي الصفحة عند اكتماله.',
      viewActions:'فتح GitHub Actions',retry:'إعادة المحاولة',noClusters:'لا توجد تجمعات مطابقة لإعدادات الخوارزمية ضمن البيانات الحالية.',
      longitude:'خط الطول',latitude:'خط العرض',count:'العدد',week:'الأسبوع',date:'التاريخ',
    },
  };
  const state = {lang: read('tp-lang')==='ar'?'ar':'en',theme:read('tp-theme')==='light'?'light':'dark',report:null, charts:[], clusterChart:null};
  const t = k => dict[state.lang][k] || k;
  const format = (n,digits=0) => Number.isFinite(Number(n))?new Intl.NumberFormat(state.lang==='ar'?'ar-SA':'en-US',{maximumFractionDigits:digits,minimumFractionDigits:digits}).format(n):'—';
  function read(k){try{return localStorage.getItem(k)}catch{return null}}
  function store(k,v){try{localStorage.setItem(k,v)}catch{}}
  const themes = () => ({text:state.theme==='dark'?'#9db4c8':'#587183',grid:state.theme==='dark'?'rgba(141,179,199,.11)':'rgba(63,102,121,.13)',teal:'#58d7cf',blue:'#72b7ec',purple:'#989af2',orange:'#f6b07e'});
  function shell(){
    document.body.dataset.theme=state.theme;
    document.documentElement.lang=state.lang;
    $('.intel-main').dir=state.lang==='ar'?'rtl':'ltr';
    $$('[data-key]').forEach(el=>{el.textContent=t(el.dataset.key)});
    $('#workspaceText').textContent=t('workspace');
    $('#languageToggle').textContent=state.lang==='ar'?'English':'عربي';
    $('#themeToggle').textContent=state.theme==='light'?'☾':'☼';
    $$('.nav-link').forEach(el=>el.style.direction=state.lang==='ar'?'rtl':'ltr');
  }
  function clearCharts(){state.charts.forEach(c=>{try{c.destroy()}catch{}});state.charts=[];state.clusterChart=null;}
  function drawChart(id,type,labels,values,opts={}){
    const ctx=document.getElementById(id);if(!ctx)return;
    if(typeof window.Chart!=='function'){ctx.replaceWith(Object.assign(document.createElement('p'),{className:'method-note',textContent:'Chart.js unavailable · '+labels.map((v,i)=>`${v}: ${values[i]}`).join(' | ')}));return}
    const palette=themes();
    const chart=new Chart(ctx,{type,
      data:{labels,datasets:[{label:t('count'),data:values,borderColor:palette.teal,backgroundColor:opts.colors||'rgba(88,215,207,.35)',fill:type==='line',borderWidth:2,tension:.32,pointRadius:type==='line'?1:0,borderRadius:type==='bar'?5:0,maxBarThickness:36}]},
      options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'nearest',intersect:false},plugins:{legend:{display:false},tooltip:{backgroundColor:'#102c40',padding:12,displayColors:false}},
        scales:{x:{ticks:{color:palette.text,maxTicksLimit:opts.maxTicks||9,font:{size:10}},grid:{display:false}},y:{beginAtZero:true,ticks:{color:palette.text,precision:0,font:{size:10}},grid:{color:palette.grid}}}}});
    state.charts.push(chart);return chart;
  }
  function statBlock(label,value,note){return `<article class="intel-stat"><small>${escapeHTML(t(label))}</small><strong>${escapeHTML(value)}</strong><p>${escapeHTML(t(note))}</p></article>`;}
  function renderCards(r){const s=r.summary;$('#statCards').innerHTML=
    statBlock('events',format(s.total_events),'eventsNote')+
    statBlock('meanMag',format(s.mean_magnitude,2),'meanNote')+
    statBlock('maxMag',format(s.max_magnitude,1),'maxNote')+
    statBlock('medianDepth',`${format(s.median_depth_km,1)} ${t('km')}`,'depthNote');}
  function renderBenchmark(r){const data=r.weekly_baseline;const cell=(key,val)=>`<div class="benchmark-cell"><small>${escapeHTML(t(key))}</small><strong>${escapeHTML(val)}</strong></div>`;
    $('#benchmarkPanel').innerHTML=`<div class="benchmark-row">${cell('weeklyLast',format(data.recent_7d))}${cell('weeklyMedian',format(data.baseline_median_7d,1))}${cell('weeklyP90',format(data.baseline_p90_7d,1))}</div><p class="intel-verdict ${data.above_baseline_p90?'unusual':''}">${escapeHTML(t(data.above_baseline_p90?'unusual':'typical'))}</p>`;
    const last13=data.weekly_series.slice(-13);
    drawChart('weeklyChart','bar',last13.map(x=>x.week_start.slice(5)),last13.map(x=>x.count),{maxTicks:7,colors:last13.map((_,i)=>i===12?'#f6b07e':'#57899e')});
  }
  function renderHotspots(r){const hotspots=r.spatial.hotspots||[];const list=$('#clusterList');
    if(!hotspots.length){list.innerHTML=`<p class="method-note">${escapeHTML(t('noClusters'))}</p>`;return}
    list.innerHTML=hotspots.map((h,i)=>`<button class="hotspot ${i===0?'active':''}" data-cluster="${i}" type="button" aria-label="${escapeHTML(t('group')+' '+(i+1))}"><span class="hotspot-rank">${i+1}</span><span class="hotspot-details"><strong>${escapeHTML(h.example_place)}</strong><small>${escapeHTML(t('mean'))} M${format(h.mean_magnitude,2)} · ${escapeHTML(t('depth'))} ${format(h.mean_depth_km,1)} ${escapeHTML(t('km'))}</small></span><span class="hotspot-count">${format(h.count)}</span></button>`).join('');
    // A simple latitude-longitude scatterplot, not a geographic hazard probability map.
    if(typeof window.Chart!=='function')return;
    const colors=themes(), canvas=$('#clusterChart');
    const chart=new Chart(canvas,{type:'bubble',data:{datasets:[{label:t('group'),data:hotspots.map(h=>({x:h.longitude,y:h.latitude,r:Math.min(22,Math.max(6,Math.sqrt(h.count)*2.2))})),backgroundColor:hotspots.map((_,i)=>i===0?'rgba(246,176,126,.83)':'rgba(88,215,207,.68)'),borderColor:colors.teal,borderWidth:1}]},
      options:{maintainAspectRatio:false,responsive:true,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>`${hotspots[ctx.dataIndex].example_place}: ${format(hotspots[ctx.dataIndex].count)} ${t('eventsCount')}`}}},
        scales:{x:{min:-180,max:180,title:{display:true,text:t('longitude'),color:colors.text},ticks:{color:colors.text},grid:{color:colors.grid}},
          y:{min:-90,max:90,title:{display:true,text:t('latitude'),color:colors.text},ticks:{color:colors.text},grid:{color:colors.grid}}},
        onClick:(_,els)=>{if(els.length)selectHotspot(els[0].index)}}});
    state.charts.push(chart);state.clusterChart=chart;
  }
  function selectHotspot(i){
    $$('.hotspot').forEach(el=>el.classList.toggle('active',Number(el.dataset.cluster)===i));
    const chart=state.clusterChart;if(!chart)return;
    chart.data.datasets[0].backgroundColor=chart.data.datasets[0].data.map((_,j)=>j===i?'rgba(246,176,126,.92)':'rgba(88,215,207,.55)');
    chart.setActiveElements([{datasetIndex:0,index:i}]);chart.update();
  }
  function render(){if(!state.report)return;
    clearCharts();shell();const r=state.report;
    $('#status').hidden=true;$('#intelData').hidden=false;
    $('#rangeLabel').textContent=`${t('range')}: ${r.methodology.start_utc} → ${r.methodology.end_exclusive_utc} (UTC, end excluded)`;
    $('#updatedLabel').textContent=`${t('asOf')}: ${new Date(r.generated_at_utc).toLocaleString(state.lang==='ar'?'ar-SA':'en-US',{dateStyle:'medium',timeStyle:'short'})}`;
    renderCards(r);
    drawChart('dailyChart','line',r.daily_last_30d.map(x=>x.date.slice(5)),r.daily_last_30d.map(x=>x.count));
    drawChart('magnitudeChart','bar',r.magnitude_distribution.map(x=>x.range),r.magnitude_distribution.map(x=>x.count),{colors:['#5ed8ca','#78acee','#a69aed','#f6b07e']});
    renderHotspots(r);
    renderBenchmark(r);
  }
  function showError(key){$('#intelData').hidden=true;const el=$('#status');el.hidden=false;el.classList.add('error');el.innerHTML=`<div><p>${escapeHTML(t(key))}</p><a class="intel-outline" target="_blank" rel="noopener noreferrer" href="https://github.com/noormoria/TerraPulse/actions/workflows/update-intelligence.yml">${escapeHTML(t('viewActions'))} ↗</a> <button class="intel-outline" id="retryLoad" type="button">${escapeHTML(t('retry'))}</button></div>`;$('#retryLoad').addEventListener('click',load);}
  async function load(){
    const el=$('#status');el.classList.remove('error');el.hidden=false;el.innerHTML=`<span class="spinner"></span><span>${escapeHTML(t('loading'))}</span>`;
    try {
      const res=await fetch(`data/insights.json?bust=${Date.now()}`,{cache:'no-store'});
      if(!res.ok)throw new Error(`HTTP ${res.status}`);
      const r=await res.json();
      if(r.status==='pending'){showError('pending');return}
      if(r.version!==1 || r.status!=='ready'||!r.summary||!r.weekly_baseline||!r.spatial||!Array.isArray(r.daily_last_30d))throw new Error('Invalid model results');
      state.report=r;render();
    }catch(e){console.warn('Unable to load historical insight dataset:',e);showError('loadingError')}
  }
  $('#languageToggle').addEventListener('click',()=>{state.lang=state.lang==='ar'?'en':'ar';store('tp-lang',state.lang);shell();if(state.report)render();else if($('#status').classList.contains('error'))showError('pending');});
  $('#themeToggle').addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';store('tp-theme',state.theme);shell();if(state.report)render();});
  $('#menuToggle').addEventListener('click',()=>{const open=$('#sidebar').classList.toggle('open');$('#mobileScrim').hidden=!open;$('#menuToggle').setAttribute('aria-expanded',String(open));});
  $('#mobileScrim').addEventListener('click',()=>{$('#sidebar').classList.remove('open');$('#mobileScrim').hidden=true;$('#menuToggle').setAttribute('aria-expanded','false');});
  document.addEventListener('click',event=>{const btn=event.target.closest('[data-cluster]');if(btn)selectHotspot(Number(btn.dataset.cluster));});
  shell();load();
})();