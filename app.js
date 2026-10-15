/* TerraPulse · Static interactive earth intelligence MVP
   Live earthquake data © USGS Earthquake Hazards Program.
   No invented events, disaster forecasts, or undisclosed AI-generated insights. */
(() => {
  'use strict';

  const FEEDS = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/';
  const CACHE_MS = 60_000;
  const ICONS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    chart: '<path d="M3 3v18h18M7 17l4-5 3 3 6-8"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5"/>',
    document: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
    external: '<path d="M14 3h7v7M21 3l-10 10"/><path d="M20 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
    moon: '<path d="M20.8 13.2A9 9 0 0 1 10.8 3.2 9 9 0 1 0 20.8 13.2Z"/>',
    languages: '<path d="m5 8 6 6m-7 0 6-6 2-3H2m5-3v3m6 16 5-11 5 11m-8-4h6"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14-5L4 8M4 4v4h4M4 13a8 8 0 0 0 14 5l2-2m0 4v-4h-4"/>',
    activity: '<path d="M2 12h4l3-8 6 16 3-8h4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    alert: '<path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v4m0 4h.01"/>',
    trend: '<path d="m3 17 6-6 4 4 8-8M15 7h6v6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
    printer: '<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 15h12v7H6z"/>',
    close: '<path d="M5 5l14 14M19 5 5 19"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6ZM9 3v15m6-12v15"/>',
    check: '<path d="M5 12l4 4L19 6"/>',
    arrowUp: '<path d="m6 15 6-6 6 6"/>',
    arrowDown: '<path d="m6 9 6 6 6-6"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>'
  };
  const icon = name => `<span class="ico" data-icon="${name}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.info}</svg></span>`;
  const tr = {
    en: {
      workspace:'WORKSPACE',overview:'Overview',explorer:'Live Explorer',analytics:'Analytics',compare:'Compare',reports:'Reports',
      dataSource:'USGS data feed',sourceFoot:'Official reported earthquakes. Not predictions.',viewSource:'View data source',platform:'Platform',
      feedStatus:'USGS FEED',footerTag:'Data informs, it does not predict.',footerSource:'Source: USGS Earthquake Hazards Program',
      heroTag:'GLOBAL SEISMIC INTELLIGENCE',heroLine1:'The planet,',heroLine2:'in perspective.',heroDesc:'Explore earthquakes around the world through verified data and a living 3D globe.',
      exploreWorld:'Explore the globe',viewAnalytics:'View analytics',threeD:'INTERACTIVE 3D EARTH',
      overviewEyebrow:'REAL-WORLD DATA · INTERACTIVE INSIGHTS',overviewTitle:'Your window into Earth activity',overviewDesc:'A real-time-style view of recently reported earthquakes, updated from official USGS feeds.',
      explorerEyebrow:'INTERACTIVE WORLD MAP',explorerTitle:'Discover the world in motion',explorerDesc:'Rotate the planet, inspect reported earthquake events and explore their details.',
      analyticsEyebrow:'EXPLORE THE NUMBERS',analyticsTitle:'Seismic activity, decoded',analyticsDesc:'Explore descriptive trends from the selected USGS dataset, not earthquake forecasts.',
      compareEyebrow:'TIME-BASED COMPARISON',compareTitle:'Measure what changed',compareDesc:'Compare earthquakes recorded in the latest 24-hour window with the 24 hours before it.',
      reportsEyebrow:'EXPORT YOUR FINDINGS',reportsTitle:'Turn data into a report',reportsDesc:'Export your current dataset as CSV or print a concise summary to PDF.',
      totalEvents:'Reported events',strongest:'Strongest magnitude',average:'Average magnitude',lastDay:'In past 24 hours',
      statSource:'USGS · selected dataset',statStrong:'Highest reported magnitude',statAverage:'Mean of reported magnitudes',statDay:'Within your current selection',
      activityTrend:'Activity over time',activityTrendDesc:'Counts of reported earthquakes',latestEvents:'Recent events',latestEventsDesc:'Select an event to inspect its details',viewAll:'View all',
      filters:'DATA FILTERS',timeRange:'Period',minimumMag:'Magnitude',search:'Search',searchPlaceholder:'Search location…',
      day:'Past 24 hours',week:'Past 7 days',month:'Past 30 days',mag2:'M2.5+',mag4:'M4.5+',refresh:'Refresh',
      loading:'Loading earthquake data from USGS…',loadingShort:'Loading data…',failed:'Could not load live USGS data. Check your internet connection and try again.',retry:'Try again',
      noEvents:'No earthquakes matched the selected filters.',noEventsShort:'No matching events',timeUnknown:'Time not available',magnitude:'Magnitude',depth:'Depth',
      latitude:'Latitude',longitude:'Longitude',reportedAt:'Reported time',place:'Location',details:'Event details',selectEvent:'Select an event on the globe or in the list to view its details.',
      globeHint:'Drag to rotate · Scroll to zoom · Select a point',globeStatus:'USGS · EARTHQUAKE EVENTS',recentActivity:'Recent activity',
      earthTime:'Actual sunlight · synced to UTC',quakeDots:'Dots show reported earthquakes',quakeMild:'M2.5–3.9',quakeMedium:'M4–4.9',quakeStrong:'M5+',
      globeUnavailable:'3D globe unavailable. The event data remains accessible below.',eventWebsite:'Open USGS record',
      magDistribution:'Magnitude distribution',magDistributionDesc:'Frequency by magnitude interval',dailyCounts:'Activity by time',dailyCountsDesc:'Reported earthquakes per time interval',
      noAnalytics:'Charts need data from the USGS feed.',importantNote:'These are observed reports, not a prediction or warning system. Counts reflect the time window and minimum magnitude selected.',
      detectedEvents:'Events in selection',strongEvents:'Magnitude 5 or greater',deepest:'Maximum depth',
      currentWindow:'Most recent 24 hours',previousWindow:'Previous 24 hours',eventsRecorded:'Earthquakes recorded',difference:'Change in event count',
      compareExplanation:'The comparison uses the M2.5+ (or M4.5+) 7-day USGS feed and equal 24-hour windows, independent of the main period filter.',
      compareChart:'Side-by-side comparison',volume:'Event count',dataForCompare:'Loading 7-day feed for comparison…',
      exportData:'Export earthquake data',exportDesc:'Download the events in the current period and magnitude selection. Your location search is also applied.',
      csvDownload:'Download CSV',printReport:'Print / Save as PDF',reportPreview:'Report preview',reportIntro:'An overview of the latest reported earthquake observations matching your filters.',
      reportGenerated:'Report prepared',reportPeriod:'Reporting period',reportMinMag:'Minimum magnitude',reportCount:'Total events',reportLargest:'Maximum magnitude',
      allData:'All events in current feed',printNote:'Choose “Save as PDF” in your browser’s print dialog.',downloadSuccess:'CSV exported',noDownload:'Nothing to export yet',
      updated:'Feed last generated',unknown:'Not available',fresh:'Updated by source',results:'Results',close:'Close',
      readMore:'View full record',clockToday:'Today',clockYesterday:'Yesterday',
      dataUnavailable:'Data currently unavailable',earthquakeLabel:'EARTHQUAKE MONITOR',noDataPoint:'No data available',
      statsToday:'Compared with previous 24 hours',increase:'increase',decrease:'decrease',noChange:'no change',
      disclaimerTitle:'What this platform does',disclaimerBody:'TerraPulse visualizes publicly reported earthquake events. It does not forecast earthquakes, assess personal safety, or replace official emergency guidance.',
      reportName:'TerraPulse • Earthquake Activity Report',liveTag:'LIVE DATA CONNECTION',sourceLoading:'Checking source…',
      navAbout:'Overview',depthUnit:'km',coordinates:'Coordinates',website:'Website',emptySearch:'Try another place name or change your filters.',
      dataSnapshot:'Loaded data from source',eventCount:'events',regionUnknown:'Unspecified location', allDataNote:'Export and report use the currently loaded data.'
    },
    ar: {
      workspace:'مساحة العمل',overview:'نظرة عامة',explorer:'استكشاف مباشر',analytics:'التحليلات',compare:'المقارنة',reports:'التقارير',
      dataSource:'بيانات هيئة USGS',sourceFoot:'زلازل مسجلة رسميًا، وليست تنبؤات.',viewSource:'عرض مصدر البيانات',platform:'المنصة',
      feedStatus:'بيانات USGS',footerTag:'البيانات تُفسّر الواقع ولا تتنبأ به.',footerSource:'المصدر: هيئة المسح الجيولوجي الأمريكية USGS',
      heroTag:'تحليلات النشاط الزلزالي العالمي',heroLine1:'استكشف الكوكب',heroLine2:'من منظور البيانات.',heroDesc:'تابع الزلازل المسجلة حول العالم باستخدام بيانات موثوقة وكرة أرضية تفاعلية ثلاثية الأبعاد.',
      exploreWorld:'استكشف الكرة الأرضية',viewAnalytics:'عرض التحليلات',threeD:'أرض تفاعلية ثلاثية الأبعاد',
      overviewEyebrow:'بيانات واقعية · رؤى تفاعلية',overviewTitle:'نافذتك لفهم نشاط الأرض',overviewDesc:'عرض للزلازل المسجلة حديثًا والمحدّثة عبر موجز بيانات USGS الرسمي.',
      explorerEyebrow:'خريطة عالمية تفاعلية',explorerTitle:'اكتشف حركة الأرض',explorerDesc:'حرّك الكرة الأرضية، واستعرض الزلازل المسجلة وتفاصيل كل حدث.',
      analyticsEyebrow:'تحليل الأرقام',analyticsTitle:'افهم النشاط الزلزالي',analyticsDesc:'حلّل أنماط البيانات المسجلة في الفترة المختارة، دون تقديم تنبؤات بالزلازل.',
      compareEyebrow:'مقارنة زمنية',compareTitle:'ما الذي تغيّر؟',compareDesc:'قارن أحداث آخر 24 ساعة بالأحداث المسجلة خلال الـ24 ساعة التي سبقتها.',
      reportsEyebrow:'تصدير النتائج',reportsTitle:'حوّل البيانات إلى تقرير',reportsDesc:'صدّر البيانات الحالية بصيغة CSV أو اطبع ملخصًا واحفظه PDF.',
      totalEvents:'الزلازل المسجلة',strongest:'أعلى قوة',average:'متوسط القوة',lastDay:'خلال آخر 24 ساعة',
      statSource:'USGS · مجموعة البيانات المختارة',statStrong:'أعلى قوة زلزالية مسجلة',statAverage:'المتوسط الحسابي لقيم القوة',statDay:'ضمن البيانات المختارة',
      activityTrend:'النشاط عبر الزمن',activityTrendDesc:'عدد الزلازل المسجلة',latestEvents:'أحدث الزلازل',latestEventsDesc:'اختاري حدثًا لعرض تفاصيله',viewAll:'عرض الكل',
      filters:'تصفية البيانات',timeRange:'الفترة',minimumMag:'القوة',search:'بحث',searchPlaceholder:'ابحثي عن موقع…',
      day:'آخر 24 ساعة',week:'آخر 7 أيام',month:'آخر 30 يومًا',mag2:'قوة +2.5',mag4:'قوة +4.5',refresh:'تحديث',
      loading:'جارٍ تحميل بيانات الزلازل من USGS…',loadingShort:'جارٍ تحميل البيانات…',failed:'تعذر تحميل بيانات USGS. تحققي من اتصال الإنترنت وحاولي مجددًا.',retry:'إعادة المحاولة',
      noEvents:'لا توجد زلازل مطابقة للفلاتر المحددة.',noEventsShort:'لا توجد أحداث مطابقة',timeUnknown:'الوقت غير متاح',magnitude:'القوة',depth:'العمق',
      latitude:'خط العرض',longitude:'خط الطول',reportedAt:'وقت التسجيل',place:'الموقع',details:'تفاصيل الحدث',selectEvent:'اختاري زلزالًا من الكرة الأرضية أو القائمة لعرض التفاصيل.',
      globeHint:'اسحبي للتدوير · مرّري للتقريب · اضغطي على نقطة',globeStatus:'USGS · الزلازل المسجلة',recentActivity:'النشاط الحديث',
      earthTime:'ضوء الشمس الحقيقي · حسب التوقيت العالمي',quakeDots:'كل نقطة تمثل زلزالًا مسجلًا',quakeMild:'قوة ٢٫٥–٣٫٩',quakeMedium:'قوة ٤–٤٫٩',quakeStrong:'قوة ٥+',
      globeUnavailable:'الكرة ثلاثية الأبعاد غير متاحة حاليًا، لكن بيانات الأحداث ما زالت ظاهرة في القائمة.',eventWebsite:'فتح سجل USGS',
      magDistribution:'توزيع درجات القوة',magDistributionDesc:'عدد الأحداث في كل فئة',dailyCounts:'النشاط حسب الوقت',dailyCountsDesc:'عدد الزلازل في كل فترة زمنية',
      noAnalytics:'تحتاج الرسومات إلى بيانات USGS أولًا.',importantNote:'هذه أحداث مسجلة وليست تنبؤًا أو نظام إنذار. الأعداد تعتمد على الفترة الزمنية والحد الأدنى للقوة المختارين.',
      detectedEvents:'الأحداث المحددة',strongEvents:'زلازل بقوة 5 فأكثر',deepest:'أقصى عمق',
      currentWindow:'آخر 24 ساعة',previousWindow:'الـ24 ساعة السابقة',eventsRecorded:'الزلازل المسجلة',difference:'التغير في العدد',
      compareExplanation:'تستخدم المقارنة بيانات آخر 7 أيام من USGS، وبنافذتين متساويتين من 24 ساعة، مستقلة عن فلتر الفترة الرئيسي.',
      compareChart:'مقارنة الفترتين',volume:'عدد الأحداث',dataForCompare:'جارٍ تحميل بيانات 7 أيام للمقارنة…',
      exportData:'تصدير بيانات الزلازل',exportDesc:'نزّلي بيانات الأحداث المطابقة للفترة والقوة المحددتين. ينطبق البحث عن الموقع أيضًا.',
      csvDownload:'تنزيل CSV',printReport:'طباعة / حفظ PDF',reportPreview:'معاينة التقرير',reportIntro:'ملخص لأحدث الزلازل المسجلة والمتوافقة مع الفلاتر المحددة.',
      reportGenerated:'تاريخ إعداد التقرير',reportPeriod:'الفترة الزمنية',reportMinMag:'الحد الأدنى للقوة',reportCount:'مجموع الزلازل',reportLargest:'أعلى قوة',
      allData:'جميع أحداث الموجز الحالي',printNote:'اختاري «حفظ بتنسيق PDF» من نافذة الطباعة.',downloadSuccess:'تم تصدير CSV',noDownload:'لا توجد بيانات للتصدير بعد',
      updated:'وقت إنشاء بيانات المصدر',unknown:'غير متاح',fresh:'تحديث من المصدر',results:'النتائج',close:'إغلاق',
      readMore:'عرض السجل الكامل',clockToday:'اليوم',clockYesterday:'أمس',
      dataUnavailable:'البيانات غير متاحة الآن',earthquakeLabel:'مراقبة النشاط الزلزالي',noDataPoint:'لا تتوفر بيانات',
      statsToday:'مقارنة بالـ24 ساعة السابقة',increase:'ارتفاع',decrease:'انخفاض',noChange:'بلا تغيير',
      disclaimerTitle:'ماذا تقدم هذه المنصة؟',disclaimerBody:'تعرض TerraPulse الزلازل المنشورة في مصادر عامة. لا تتنبأ بحدوث الزلازل، ولا تقيم السلامة الشخصية، ولا تستبدل تعليمات الجهات الرسمية للطوارئ.',
      reportName:'TerraPulse • تقرير النشاط الزلزالي',liveTag:'اتصال مباشر بمصدر البيانات',sourceLoading:'جارٍ التحقق من المصدر…',
      navAbout:'نظرة عامة',depthUnit:'كم',coordinates:'الإحداثيات',website:'الموقع الإلكتروني',emptySearch:'جرّبي اسم موقع آخر أو غيري الفلاتر.',
      dataSnapshot:'بيانات محمّلة من المصدر',eventCount:'زلزال',regionUnknown:'موقع غير محدد',allDataNote:'تعتمد ملفات التصدير والتقارير على البيانات الحالية.'
    }
  };
  const $ = s => document.querySelector(s);
  const t = k => tr[state.lang][k] || k;
  const x = input => String(input ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const state = {
    lang: safeStorage('tp-lang') === 'ar' ? 'ar' : 'en',
    theme: safeStorage('tp-theme') === 'light' ? 'light' : 'dark',
    page: ['overview','explorer','analytics','compare','reports'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'overview',
    period:'week', minMag:'2.5', search:'', data:[], generated:null, loading:true, error:false,
    selected:null, compareData:null, compareLoading:false, compareError:false
  };
  const feedCache = new Map();
  let globe = null, globeObserver = null, stopSolarLighting = null, chartInstances = [], toastTimer = null, searchTimer = null, requestId = 0;

  function safeStorage(k) { try { return localStorage.getItem(k); } catch { return null; } }
  function store(k,v) { try { localStorage.setItem(k,v); } catch {} }
  function num(n, digits=0) {return Number.isFinite(Number(n)) ? new Intl.NumberFormat(state.lang === 'ar'?'ar-SA':'en-US',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(n) : '—';}
  function dateString(ms, opts={dateStyle:'medium',timeStyle:'short'}) {return Number.isFinite(ms) ? new Intl.DateTimeFormat(state.lang === 'ar'?'ar-SA':'en-US',opts).format(new Date(ms)) : t('unknown');}
  function relativeTime(ms) {
    if (!Number.isFinite(ms)) return t('unknown');
    const delta = Math.max(0,Date.now()-ms), fmt = new Intl.RelativeTimeFormat(state.lang === 'ar'?'ar-SA':'en-US',{numeric:'auto'});
    if(delta < 90_000) return fmt.format(-Math.max(1,Math.round(delta/60_000)),'minute');
    if(delta < 3_600_000) return fmt.format(-Math.round(delta/60_000),'minute');
    if(delta < 86_400_000) return fmt.format(-Math.round(delta/3_600_000),'hour');
    return fmt.format(-Math.round(delta/86_400_000),'day');
  }
  function magColor(m) {return m >= 5 ? '#f58c98' : m >= 4 ? '#ffbc82' : '#53dec9';}
  function magClass(m) {return m >= 5 ? 'strong' : m >= 4 ? 'medium' : '';}
  function safeUSGSLink(href) {try {const url=new URL(href);return url.protocol==='https:' && (url.hostname==='earthquake.usgs.gov' || url.hostname.endsWith('.usgs.gov')) ? url.href : null;}catch{return null;}}
  function normalize(feed) {
    if (!feed || !Array.isArray(feed.features)) throw new Error('Invalid USGS GeoJSON format');
    return feed.features.filter(o=>o && o.properties && Array.isArray(o.geometry?.coordinates) && Number.isFinite(o.properties.mag))
      .map(o => ({id:String(o.id), mag:o.properties.mag,place:o.properties.place || tr.en.regionUnknown,time:Number(o.properties.time),
        updated:Number(o.properties.updated),lng:Number(o.geometry.coordinates[0]),lat:Number(o.geometry.coordinates[1]),depth:Number(o.geometry.coordinates[2]),url:safeUSGSLink(o.properties.url),tsunami:o.properties.tsunami === 1}))
      .filter(o => Number.isFinite(o.time) && Number.isFinite(o.lat) && Number.isFinite(o.lng))
      .sort((a,b)=>b.time-a.time);
  }
  async function fetchFeed(minMag,period, force=false) {
    const key=`${minMag}_${period}`;
    if(!force && feedCache.has(key) && Date.now()-feedCache.get(key).received<CACHE_MS) return feedCache.get(key);
    const ctrl = new AbortController(); const timeout=setTimeout(()=>ctrl.abort(),16000);
    try {
      const res=await fetch(`${FEEDS}${key}.geojson`,{signal:ctrl.signal,cache:'no-store'});
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const body=await res.json(); const entry={data:normalize(body),generated:Number(body.metadata?.generated)||Date.now(),received:Date.now()};
      feedCache.set(key,entry); return entry;
    } finally {clearTimeout(timeout);}
  }
  async function loadData(force=false) {
    const myRequest=++requestId; state.loading=true;state.error=false;render();
    try {
      const entry=await fetchFeed(state.minMag,state.period,force);
      if(myRequest!==requestId) return;
      state.data=entry.data;state.generated=entry.generated;state.error=false;
    } catch (err) {
      if(myRequest!==requestId) return;
      console.warn('TerraPulse USGS feed error:',err);state.error=true;
      const key=`${state.minMag}_${state.period}`;const fallback=feedCache.get(key);
      if(fallback){state.data=fallback.data;state.generated=fallback.generated;}else{state.data=[];state.generated=null;}
    } finally {if(myRequest===requestId){state.loading=false;render();}}
  }
  async function loadCompare() {
    if(state.compareLoading) return;
    state.compareLoading=true;state.compareError=false;render();
    try { const v=await fetchFeed(state.minMag,'week');state.compareData=v.data; }
    catch(err){console.warn('Compare feed failed:',err);state.compareError=true;state.compareData=null;}
    finally{state.compareLoading=false;if(state.page==='compare')render();}
  }
  function filtered() {const q=state.search.trim().toLocaleLowerCase();return q ? state.data.filter(e=>e.place.toLocaleLowerCase().includes(q)) : state.data;}
  function stats(data) {
    const total=data.length, strongest=total?Math.max(...data.map(e=>e.mag)):null;
    const avg=total?data.reduce((s,e)=>s+e.mag,0)/total:null;
    const now=Date.now(),day=data.filter(e=>e.time>=now-86_400_000).length;
    return {total,strongest,avg,day,deepest:total?Math.max(...data.map(e=>e.depth)):null,large:data.filter(e=>e.mag>=5).length};
  }
  function iconHTML() {document.querySelectorAll('.ico[data-icon]').forEach(node=>{const id=node.dataset.icon;node.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[id]||ICONS.info}</svg>`;});}
  function applyShell() {
    document.documentElement.lang=state.lang;document.documentElement.dir='ltr';document.body.dataset.theme=state.theme;
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
    $('#breadcrumb-page').textContent=t(state.page);$('#languageLabel').textContent=state.lang==='en'?'عربي':'English';
    $('#themeToggle').innerHTML=icon(state.theme==='dark'?'sun':'moon');
    $('#year').textContent=new Date().getFullYear();
    document.querySelectorAll('[data-nav]').forEach(el=>{el.classList.toggle('active',el.dataset.nav===state.page);if(el.classList.contains('nav-link')){el.setAttribute('aria-current',el.dataset.nav===state.page?'page':'false');}});
    document.querySelectorAll('.nav-link').forEach(el=>el.style.direction=state.lang==='ar'?'rtl':'ltr');
    document.querySelector('.status-line .live-dot').style.background=state.error?'#ed8998':'#46deb6';
    iconHTML();
  }
  function sectionIntro(page) {return `<div class="page-intro"><div class="${state.lang==='ar'?'text-rtl':''}"><div class="eyebrow">${x(t(page+'Eyebrow'))}</div><h1 class="page-title">${x(t(page+'Title'))}</h1><p class="page-subtitle">${x(t(page+'Desc'))}</p></div>${page==='overview'?`<span class="tag">${icon(state.error?'alert':'activity')} ${x(t(state.error?'dataUnavailable':'liveTag'))}</span>`:''}</div>`;}
  function statCard(iconId,title,value,note) {return `<article class="card stat-card"><span class="stat-heading">${icon(iconId)}${x(title)}</span><div class="stat-value">${x(value)}</div><div class="stat-note">${x(note)}</div><span class="stat-accent" aria-hidden="true"></span></article>`;}
  function dataStats() {
    const s=stats(filtered());return `<div class="dashboard-stats">
      ${statCard('activity',t('totalEvents'),num(s.total),t('statSource'))}
      ${statCard('alert',t('strongest'),s.strongest===null?'—':num(s.strongest,1),t('statStrong'))}
      ${statCard('target',t('average'),s.avg===null?'—':num(s.avg,2),t('statAverage'))}
      ${statCard('clock',t('lastDay'),num(s.day),t('statDay'))}
    </div>`;
  }
  function errorMessage() {return state.error?`<div class="error-box">${icon('alert')}<span>${x(t('failed'))}</span><button class="secondary-btn small-btn" data-action="refresh">${x(t('retry'))}</button></div>`:'';}
  function selectionToolbar(search=true){return `<div class="card toolbar no-print">
    <div class="toolbar-title">${icon('layers')}${x(t('filters'))}</div>
    <div class="filter-row">
      <div class="filter-wrap"><label for="periodSelect">${x(t('timeRange'))}</label><select id="periodSelect" data-filter="period">
      ${[['day','day'],['week','week'],['month','month']].map(([val,txt])=>`<option value="${val}"${val===state.period?' selected':''}>${x(t(txt))}</option>`).join('')}
      </select></div>
      <div class="filter-wrap"><label for="magnitudeSelect">${x(t('minimumMag'))}</label><select id="magnitudeSelect" data-filter="minMag">
      <option value="2.5" ${state.minMag==='2.5'?'selected':''}>${x(t('mag2'))}</option><option value="4.5" ${state.minMag==='4.5'?'selected':''}>${x(t('mag4'))}</option>
      </select></div>
      ${search?`<div class="search-wrap">${icon('search')}<input id="locationSearch" type="search" value="${x(state.search)}" placeholder="${x(t('searchPlaceholder'))}" aria-label="${x(t('search'))}" /></div>`:''}
      <button class="icon-button" type="button" data-action="refresh" aria-label="${x(t('refresh'))}" title="${x(t('refresh'))}">${icon('refresh')}</button>
    </div>
  </div>`;}
  function eventRow(evt) {return `<button class="event-row" data-event-id="${x(evt.id)}" type="button" aria-label="${x(evt.place)}, ${x(t('magnitude'))} ${evt.mag}"><span class="magnitude-chip ${magClass(evt.mag)}">${x(num(evt.mag,1))}</span><span class="event-description"><span class="event-name" dir="auto">${x(evt.place)}</span><span class="event-meta">${x(relativeTime(evt.time))} · ${x(num(evt.depth,1))} ${x(t('depthUnit'))}</span></span><span class="event-chevron" aria-hidden="true">›</span></button>`;}
  function eventsList(data,count) {if(!data.length)return `<p class="selected-blank">${x(t('noEventsShort'))}</p>`;return data.slice(0,count).map(eventRow).join('');}
  function updatedNote() {return `<span class="card-subtitle">${x(t('updated'))}: ${state.generated?x(dateString(state.generated)):x(t('unknown'))}</span>`;}
  function quakeLegend(){return `<div class="quake-legend" aria-label="${x(t('quakeDots'))}"><span class="quake-legend-title">${x(t('quakeDots'))}</span><span class="quake-level"><i class="quake-dot mild"></i>${x(t('quakeMild'))}</span><span class="quake-level"><i class="quake-dot medium"></i>${x(t('quakeMedium'))}</span><span class="quake-level"><i class="quake-dot strong"></i>${x(t('quakeStrong'))}</span></div>`;}
  function globeMarkup(id,hero) {return `<div id="${id}" class="${hero?'hero-globe':'explorer-globe'}"><div class="globe-fallback" aria-hidden="true">${icon('globe')}</div></div>`;}
  function renderOverview(){const rows=filtered();return `${sectionIntro('overview')}${errorMessage()}
    <section class="hero">
      <div class="hero-copy ${state.lang==='ar'?'text-rtl':''}"><div class="hero-label"><span class="live-dot"></span>${x(t('heroTag'))}</div>
        <h1>${x(t('heroLine1'))}<br/><span>${x(t('heroLine2'))}</span></h1><p>${x(t('heroDesc'))}</p>
        <div class="hero-actions"><button class="primary-btn" data-nav="explorer">${x(t('exploreWorld'))}${icon('arrow')}</button><button class="ghost-btn" data-nav="analytics">${x(t('viewAnalytics'))}</button></div>
      </div>${globeMarkup('heroGlobe',true)}<span class="globe-overlay"></span><span class="hero-corner">◉ ${x(t('threeD'))}</span>
    </section>${selectionToolbar(false)}${dataStats()}
    <div class="section-grid"><section class="card section-card"><div class="card-header"><div><div class="card-title">${x(t('activityTrend'))}</div><div class="card-subtitle">${x(t('activityTrendDesc'))}</div></div><button class="text-link" data-nav="analytics">${x(t('viewAll'))}${icon('arrow')}</button></div>
      <div class="chart-area">${rows.length?'<canvas id="overviewChart" aria-label="Earthquake frequency over time" role="img"></canvas>':`<div class="chart-empty">${x(t('noAnalytics'))}</div>`}</div></section>
    <section class="card section-card"><div class="card-header"><div><div class="card-title">${x(t('latestEvents'))}</div><div class="card-subtitle">${x(t('latestEventsDesc'))}</div></div><button class="text-link" data-nav="explorer">${x(t('viewAll'))}${icon('arrow')}</button></div><div class="event-list">${eventsList(rows,5)}</div></section></div>
    ${disclaimer()}`;}
  function selectedMarkup() {
    const e=state.selected;if(!e)return `<div class="selected-blank">${x(t('selectEvent'))}</div>`;
    return `<div class="magnitude-chip ${magClass(e.mag)}">${x(num(e.mag,1))}</div><h3 style="font-size:15px;line-height:1.5;margin:10px 0" dir="auto">${x(e.place)}</h3>
      <span class="card-subtitle">${x(dateString(e.time))}</span><div class="details-grid"><div><div class="details-key">${x(t('depth'))}</div><div class="details-value">${x(num(e.depth,1))} ${x(t('depthUnit'))}</div></div>
      <div><div class="details-key">${x(t('coordinates'))}</div><div class="details-value">${x(num(e.lat,2))}, ${x(num(e.lng,2))}</div></div></div>
      ${e.url?`<a class="secondary-btn small-btn" href="${x(e.url)}" target="_blank" rel="noopener noreferrer">${x(t('eventWebsite'))}${icon('external')}</a>`:''}`;
  }
  function renderExplorer(){const rows=filtered();return `${sectionIntro('explorer')}${errorMessage()}${selectionToolbar()}
    <div class="explorer-grid"><section class="card globe-card"><div class="globe-card-title">${x(t('globeStatus'))}</div>${globeMarkup('explorerGlobe',false)}<div class="globe-sun-note">${icon('sun')}${x(t('earthTime'))}</div>${quakeLegend()}<div class="globe-control-hint">${x(t('globeHint'))}</div></section>
    <div class="explorer-side"><section class="card selected-card"><div class="card-title">${x(t('details'))}</div><div id="selectedEvent">${selectedMarkup()}</div></section>
    <section class="card section-card"><div class="card-header"><div><div class="card-title">${x(t('recentActivity'))}</div><div class="card-subtitle">${x(t('results'))}: ${num(rows.length)}</div></div></div><div class="event-scroll">${eventsList(rows,40)}</div></section></div></div>
    ${disclaimer()}`;}
  function renderAnalytics(){const rows=filtered(),s=stats(rows);return `${sectionIntro('analytics')}${errorMessage()}${selectionToolbar()}
  <div class="insight-row"><div class="card insight-card"><span class="card-subtitle">${x(t('detectedEvents'))}</span><strong>${num(s.total)}</strong><small>${x(t('statSource'))}</small></div>
  <div class="card insight-card"><span class="card-subtitle">${x(t('strongEvents'))}</span><strong>${num(s.large)}</strong><small>${x(t('statSource'))}</small></div>
  <div class="card insight-card"><span class="card-subtitle">${x(t('deepest'))}</span><strong>${s.deepest===null?'—':num(s.deepest,1)+' '+t('depthUnit')}</strong><small>${x(t('statSource'))}</small></div></div>
  <div class="anal-grid"><section class="card section-card"><div class="card-header"><div><div class="card-title">${x(t('dailyCounts'))}</div><div class="card-subtitle">${x(t('dailyCountsDesc'))}</div></div></div><div class="chart-area tall">${rows.length?'<canvas id="timelineChart" aria-label="Earthquake count timeline" role="img"></canvas>':`<div class="chart-empty">${x(t('noAnalytics'))}</div>`}</div></section>
  <section class="card section-card"><div class="card-header"><div><div class="card-title">${x(t('magDistribution'))}</div><div class="card-subtitle">${x(t('magDistributionDesc'))}</div></div></div><div class="chart-area tall">${rows.length?'<canvas id="magnitudeChart" aria-label="Magnitude distribution" role="img"></canvas>':`<div class="chart-empty">${x(t('noAnalytics'))}</div>`}</div></section></div>
  ${disclaimer()}`;}
  function compareStats() {
    const rows=state.compareData || [],now=Date.now(),cut=now-86_400_000,cut2=now-2*86_400_000;
    const current=rows.filter(e=>e.time>=cut&&e.time<=now),previous=rows.filter(e=>e.time>=cut2&&e.time<cut);
    return {current,previous,change:current.length-previous.length};
  }
  function renderCompare(){if(state.compareLoading && !state.compareData){return `${sectionIntro('compare')}<div class="loading-state"><span class="spinner"></span>${x(t('dataForCompare'))}</div>`;}
    if(state.compareError && !state.compareData){return `${sectionIntro('compare')}<div class="error-box">${icon('alert')}<span>${x(t('failed'))}</span><button class="secondary-btn" data-action="compare-retry">${x(t('retry'))}</button></div>`;}
    if(!state.compareData){return `${sectionIntro('compare')}<div class="loading-state"><span class="spinner"></span>${x(t('dataForCompare'))}</div>`;}
    const v=compareStats(),p=Math.max(v.current.length,v.previous.length,1);
    return `${sectionIntro('compare')}${selectionToolbar(false)}<div class="compare-stats">
      <article class="card compare-card"><div class="eyebrow">01 / ${x(t('currentWindow'))}</div><div class="large-num">${num(v.current.length)}</div><div class="sub">${x(t('eventsRecorded'))}</div></article>
      <article class="card compare-card"><div class="eyebrow" style="color:var(--purple)">02 / ${x(t('previousWindow'))}</div><div class="large-num">${num(v.previous.length)}</div><div class="sub">${x(t('eventsRecorded'))}</div></article></div>
      <div class="compare-change">${icon(v.change>0?'arrowUp':v.change<0?'arrowDown':'layers')} <strong>${x(t('difference'))}: ${v.change>0?'+':''}${num(v.change)}</strong><span style="color:var(--muted)">${x(t(v.change>0?'increase':v.change<0?'decrease':'noChange'))}</span></div>
      <section class="card section-card" style="margin-top:19px"><div class="card-title">${x(t('compareChart'))}</div><div class="compare-bars">
      <div><div class="compare-bar-label"><span>${x(t('currentWindow'))}</span><strong>${num(v.current.length)}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${(v.current.length/p)*100}%"></div></div></div>
      <div><div class="compare-bar-label"><span>${x(t('previousWindow'))}</span><strong>${num(v.previous.length)}</strong></div><div class="bar-track"><div class="bar-fill alt" style="width:${(v.previous.length/p)*100}%"></div></div></div></div>
      <div class="info-box">${icon('info')}<span>${x(t('compareExplanation'))}</span></div></section>${disclaimer()}`;
  }
  function renderReports(){const s=stats(filtered());return `${sectionIntro('reports')}${errorMessage()}${selectionToolbar()}
    <div class="reports-layout"><section class="card report-card"><div class="eyebrow">${x(t('exportData'))}</div><div class="card-title">${x(t('reportName'))}</div><p class="page-subtitle">${x(t('exportDesc'))}</p>
      <div class="report-actions"><button class="primary-btn" data-action="csv">${icon('download')}${x(t('csvDownload'))}</button><button class="secondary-btn" data-action="print">${icon('printer')}${x(t('printReport'))}</button></div>
      <p class="card-subtitle" style="margin-top:20px">${x(t('printNote'))}</p><div class="info-box">${icon('info')}<span>${x(t('allDataNote'))}</span></div></section>
      <section class="card report-card"><div class="report-preview"><h3>${x(t('reportName'))}</h3><p>${x(t('reportIntro'))}</p>
      <p><strong>${x(t('reportPeriod'))}:</strong> ${x(t(state.period))} &nbsp; · &nbsp; <strong>${x(t('reportMinMag'))}:</strong> ${x(t(state.minMag==='2.5'?'mag2':'mag4'))}</p>
      <p><strong>${x(t('reportGenerated'))}:</strong> ${x(dateString(Date.now()))}</p>
      <div class="report-metrics"><div class="report-metric"><b>${num(s.total)}</b><span>${x(t('reportCount'))}</span></div><div class="report-metric"><b>${s.strongest===null?'—':num(s.strongest,1)}</b><span>${x(t('reportLargest'))}</span></div></div>
      <p style="margin-top:25px">${x(t('footerSource'))}. ${x(t('disclaimerBody'))}</p></div></section></div>`;
  }
  function disclaimer(){return `<div class="info-box">${icon('info')}<div><strong style="color:var(--text)">${x(t('disclaimerTitle'))}</strong><br/>${x(t('disclaimerBody'))}</div></div>`;}
  function createBuckets(rows){
    const bins=[],isDay=state.period==='day',len=isDay?12:state.period==='week'?7:10,
    width=isDay?2*3_600_000:state.period==='week'?86_400_000:3*86_400_000,
    now=Date.now(),end=isDay?now:Math.floor(now/86_400_000)*86_400_000+86_400_000;
    for(let i=len-1;i>=0;i--){const finish=end-i*width,start=finish-width;
      let label=isDay?new Intl.DateTimeFormat(state.lang==='ar'?'ar-SA':'en-US',{hour:'numeric'}).format(new Date(start)):
        new Intl.DateTimeFormat(state.lang==='ar'?'ar-SA':'en-US',{month:'short',day:'numeric'}).format(new Date(start));
      bins.push({label,start,end:finish,count:rows.filter(r=>r.time>=start&&r.time<finish).length});
    }return bins;
  }
  function teardownVisuals(){if(stopSolarLighting){stopSolarLighting();stopSolarLighting=null;}chartInstances.forEach(c=>{try{c.destroy()}catch{}});chartInstances=[];
    if(globeObserver){globeObserver.disconnect();globeObserver=null;}
    if(globe){try{globe._destructor()}catch{}globe=null;}}
  function chartStyles(){const light=state.theme==='light';return {text:light?'#647b8b':'#8297aa',grid:light?'#dce9ef':'#1a3445',ticks:light?'#264456':'#aec5d3'};}
  function fallbackChart(target, rows, kind) {
    const canvas = document.getElementById(target);if(!canvas)return;
    const mount=canvas.parentElement;
    const bins=kind==='mags'?[...[[2.5,3],[3,4],[4,5],[5,6],[6,Infinity]].map(([a,b])=>({count:rows.filter(e=>e.mag>=a&&e.mag<b).length})),]:createBuckets(rows);
    const labels=kind==='mags'?['2.5–2.9','3.0–3.9','4.0–4.9','5.0–5.9','6.0+']:bins.map(b=>b.label);
    const values=bins.map(b=>b.count),peak=Math.max(1,...values),w=640,h=240,pad=34;
    const step=(w-pad*2)/values.length;
    const text=labels.map((lab,i)=>`<text x="${pad+i*step+step/2}" y="${h-10}" fill="var(--muted)" font-size="11" text-anchor="middle">${x(lab)}</text>`).join('');
    const guides=[0,.25,.5,.75,1].map(v=>`<line x1="${pad}" x2="${w-pad}" y1="${h-pad-v*(h-2*pad)}" y2="${h-pad-v*(h-2*pad)}" stroke="var(--edge)" stroke-width="1"/>`).join('');
    let shapes='';
    if(kind==='mags')shapes=values.map((n,i)=>`<rect x="${pad+i*step+step*.20}" y="${h-pad-(n/peak)*(h-2*pad)}" width="${step*.6}" height="${(n/peak)*(h-2*pad)}" fill="${['#5fdacc','#54b6d9','#7b97da','#f0ad7a','#f4869c'][i]}" rx="5"/>`).join('');
    else {
      const coords=values.map((n,i)=>[pad+i*step+step/2,h-pad-(n/peak)*(h-2*pad)]),path=coords.map(([px,py],i)=>`${i?'L':'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');
      shapes=`<path d="${path}" fill="none" stroke="#66dfe0" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`+coords.map(([px,py])=>`<circle cx="${px}" cy="${py}" r="4" fill="#75e6e3"/>`).join('');
    }
    canvas.remove();mount.innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${x(kind==='mags'?t('magDistribution'):t('activityTrend'))}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">${guides}${shapes}${text}</svg>`;
  }
  function chartLine(target,rows){if(typeof window.Chart!=='function'){fallbackChart(target,rows,'timeline');return;}
    const el=document.getElementById(target);if(!el)return;const bins=createBuckets(rows),s=chartStyles();
    const c=new Chart(el,{type:'line',data:{labels:bins.map(b=>b.label),datasets:[{data:bins.map(b=>b.count),borderColor:'#62d6d9',backgroundColor:'rgba(74,205,210,.11)',fill:true,tension:.36,pointRadius:2.5,pointHoverRadius:5,pointBackgroundColor:'#7ce4e3',borderWidth:2.5}]},
      options:{responsive:true,maintainAspectRatio:false,animation:{duration:650},plugins:{legend:{display:false},tooltip:{backgroundColor:'#0d2639',padding:11,displayColors:false}},
        scales:{x:{grid:{display:false},border:{display:false},ticks:{color:s.text,maxRotation:0,autoSkip:true,maxTicksLimit:7,font:{size:10}}},y:{beginAtZero:true,grid:{color:s.grid},border:{display:false},ticks:{color:s.text,precision:0,font:{size:10}}}}}});
    chartInstances.push(c);
  }
  function chartMags(target,rows){if(typeof window.Chart!=='function'){fallbackChart(target,rows,'mags');return;}
    const el=document.getElementById(target);if(!el)return;const ranges=[[2.5,3],[3,4],[4,5],[5,6],[6,Infinity]],bins=ranges.map(([min,max])=>rows.filter(e=>e.mag>=min&&e.mag<max).length),s=chartStyles();
    const c=new Chart(el,{type:'bar',data:{labels:['2.5–2.9','3.0–3.9','4.0–4.9','5.0–5.9','6.0+'],datasets:[{data:bins,backgroundColor:['#5fdacc','#54b6d9','#7b97da','#f0ad7a','#f4869c'],borderRadius:7,maxBarThickness:55}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#0d2639',padding:11,displayColors:false}},scales:{x:{grid:{display:false},border:{display:false},ticks:{color:s.text,font:{size:10}}},y:{beginAtZero:true,grid:{color:s.grid},border:{display:false},ticks:{precision:0,color:s.text,font:{size:10}}}}}});
    chartInstances.push(c);
  }
  function attachGlobe(selector,hero) {
    const el=document.getElementById(selector);if(!el)return;
    if(typeof window.Globe!=='function'){if(!hero){const caption=document.createElement('div');caption.className='globe-control-hint';caption.style.bottom='60px';caption.textContent=t('globeUnavailable');el.appendChild(caption);}return;}
    try {
      const entries=filtered().slice(0,650);
      // Start with a bright Earth image while true solar shading textures load.
      globe=new Globe(el,{rendererConfig:{antialias:true,alpha:true}})
        .globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg')
        .bumpImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png')
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true).atmosphereColor('#6ac3e1').atmosphereAltitude(.17)
        .pointsData(entries).pointLat(e=>e.lat).pointLng(e=>e.lng)
        .pointAltitude(.0015).pointRadius(e=>e.mag>=5?.31:e.mag>=4?.25:.19)
        .pointColor(e=>magColor(e.mag))
        .pointLabel(e=>`${x(e.place)} · M${x(e.mag.toFixed(1))}`)
        .pointResolution(12).pointsMerge(false)
        .onPointClick(e=>{state.selected=e;if(state.page==='explorer'){$('#selectedEvent').innerHTML=selectedMarkup();iconHTML();}else{openModal(e);}});
      globe.width(el.clientWidth).height(el.clientHeight);
      globe.pointOfView({lat:23,lng:49,altitude:hero?2.15:2.1},0);
      const controls=globe.controls();controls.autoRotate=true;controls.autoRotateSpeed=hero?.3:.18;controls.enableZoom=true;
      if(hero)controls.enableZoom=false;
      const fallback=el.querySelector('.globe-fallback');if(fallback)fallback.remove();
      if('ResizeObserver' in window){globeObserver=new ResizeObserver(()=>{if(globe&&el.isConnected)globe.width(el.clientWidth).height(el.clientHeight);});globeObserver.observe(el);}
      const activeGlobe=globe;
      import('./solar-globe.js').then(({startSolarLighting})=>startSolarLighting(activeGlobe,()=>globe===activeGlobe))
        .then(stop=>{if(!stop)return;if(globe===activeGlobe)stopSolarLighting=stop;else stop();})
        .catch(err=>console.warn('Solar lighting unavailable; using the clear daytime map:',err));
    }catch(err){console.warn('Globe renderer unavailable:',err);globe=null;}
  }
  function render(){teardownVisuals();applyShell();const main=$('#main');
    if(state.loading){main.innerHTML=`${sectionIntro(state.page)}<div class="loading-state"><span class="spinner" role="status"></span>${x(t('loading'))}</div>`;return;}
    switch(state.page){case 'overview':main.innerHTML=renderOverview();break;case 'explorer':main.innerHTML=renderExplorer();break;
      case 'analytics':main.innerHTML=renderAnalytics();break;case 'compare':main.innerHTML=renderCompare();break;case 'reports':main.innerHTML=renderReports();break;}
    if(state.page==='overview'){attachGlobe('heroGlobe',true);chartLine('overviewChart',filtered());}
    if(state.page==='explorer')attachGlobe('explorerGlobe',false);
    if(state.page==='analytics'){chartLine('timelineChart',filtered());chartMags('magnitudeChart',filtered());}
  }
  function navigate(page){if(!['overview','explorer','analytics','compare','reports'].includes(page))return;
    state.page=page;state.selected=null;history.replaceState(null,'',`#${page}`);closeSidebar();closeModal();
    if(page==='compare' && (!state.compareData || state.compareError)){loadCompare();}else render();
    window.scrollTo({top:0,behavior:'auto'});
  }
  function showToast(message){const el=$('#toast');el.textContent=message;el.classList.add('shown');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('shown'),3000);}
  function openModal(event){const host=$('#modalHost');host.hidden=false;
    host.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-label="${x(t('details'))}"><button class="icon-button close-modal" data-action="close-modal" aria-label="${x(t('close'))}">${icon('close')}</button><span class="eyebrow">${x(t('details'))} · USGS</span><h2 dir="auto">${x(event.place)}</h2><span class="meta">${x(dateString(event.time))}</span>
    <div class="details-grid"><div><div class="details-key">${x(t('magnitude'))}</div><div class="details-value" style="color:${magColor(event.mag)}">${x(num(event.mag,1))}</div></div>
    <div><div class="details-key">${x(t('depth'))}</div><div class="details-value">${x(num(event.depth,1))} ${x(t('depthUnit'))}</div></div>
    <div><div class="details-key">${x(t('coordinates'))}</div><div class="details-value">${x(num(event.lat,2))}, ${x(num(event.lng,2))}</div></div></div>
    ${event.url?`<a class="primary-btn" href="${x(event.url)}" target="_blank" rel="noopener noreferrer">${x(t('readMore'))}${icon('external')}</a>`:''}</div>`;
    const button=host.querySelector('.close-modal');button.focus();
  }
  function closeModal(){const host=$('#modalHost');host.hidden=true;host.innerHTML='';}
  function closeSidebar(){$('#sidebar').classList.remove('open');$('#mobileScrim').hidden=true;$('#menuToggle').setAttribute('aria-expanded','false');}
  function downloadCsv(){const rows=filtered();if(!rows.length){showToast(t('noDownload'));return;}
    const safeCsv=s=>{let val=String(s??'');if(/^[\s]*[=+@-]/.test(val)&&typeof s==='string')val="'"+val;return `"${val.replaceAll('"','""')}"`;};
    const headers=['event_id','place','magnitude','depth_km','latitude','longitude','reported_at_utc','usgs_url'];
    const lines=[headers.map(safeCsv).join(','),...rows.map(e=>[e.id,e.place,e.mag,e.depth,e.lat,e.lng,new Date(e.time).toISOString(),e.url||''].map(safeCsv).join(','))];
    const blob=new Blob(['\uFEFF',lines.join('\r\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=`terrapulse_earthquakes_${state.period}_${state.minMag}_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast(t('downloadSuccess'));
  }
  document.addEventListener('click',evt=>{
    if(evt.target.id==='mobileScrim'){closeSidebar();return;}
    if(evt.target.id==='modalHost'){closeModal();return;}
    const nav=evt.target.closest('[data-nav]');if(nav){evt.preventDefault();navigate(nav.dataset.nav);return;}
    const eventBtn=evt.target.closest('[data-event-id]');if(eventBtn){const event=filtered().find(o=>o.id===eventBtn.dataset.eventId);if(event){state.selected=event;openModal(event);
      if(globe && state.page==='explorer')globe.pointOfView({lat:event.lat,lng:event.lng,altitude:1.4},850);}return;}
    const action=evt.target.closest('[data-action]');if(!action)return;
    switch(action.dataset.action){case 'refresh':loadData(true);break;case 'compare-retry':loadCompare();break;
      case 'close-modal':closeModal();break;case 'csv':downloadCsv();break;case 'print':window.print();break;}
  });
  document.addEventListener('change',evt=>{
    const control=evt.target.closest('[data-filter]');if(!control)return;
    if(control.dataset.filter==='period')state.period=control.value;
    if(control.dataset.filter==='minMag'){state.minMag=control.value;state.compareData=null;}
    state.selected=null;loadData();
    if(state.page==='compare')loadCompare();
  });
  document.addEventListener('input',evt=>{
    if(evt.target.id!=='locationSearch')return;
    const cursor=evt.target.selectionStart;state.search=evt.target.value;clearTimeout(searchTimer);
    searchTimer=setTimeout(()=>{render();const next=$('#locationSearch');if(next){next.focus();try{next.setSelectionRange(cursor,cursor);}catch{}}},250);
  });
  document.addEventListener('keydown',evt=>{if(evt.key==='Escape'){closeModal();closeSidebar();}});
  $('#languageToggle').addEventListener('click',()=>{state.lang=state.lang==='en'?'ar':'en';store('tp-lang',state.lang);render();if(!$('#modalHost').hidden)closeModal();});
  $('#themeToggle').addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';store('tp-theme',state.theme);render();});
  $('#menuToggle').addEventListener('click',()=>{const open=$('#sidebar').classList.toggle('open');$('#mobileScrim').hidden=!open;$('#menuToggle').setAttribute('aria-expanded',String(open));});
  window.addEventListener('hashchange',()=>{const page=location.hash.replace('#','');if(page!==state.page)navigate(page);});

  applyShell();loadData();
})();