(function(){
  const VERSION='ARENA V15';
  const PROFILE_KEY='khallak_raed_profile_v12';
  const META_KEY='khallak_raed_music_meta_v15';
  const DB_NAME='khallak_raed_media_v15';
  const STORE='clips';
  const MUSIC_ID='premium-music';
  const VALUES=[200,200,400,400,600,600];
  let activeAudio=null,activeObjectUrl='';

  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function ensureStyles(){if(document.querySelector('link[data-music-v15]'))return;const l=document.createElement('link');l.rel='stylesheet';l.href='music-audio-v15.css?v=20260908-v15';l.dataset.musicV15='1';document.head.appendChild(l);}
  function profile(){try{const p=JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}')||{};if(!Array.isArray(p.ownedCategories))p.ownedCategories=[];return p;}catch{return {ownedCategories:[]};}}
  function owned(){return profile().ownedCategories.includes(MUSIC_ID);}
  function blankSlot(){return {configured:false,mode:'singer',singer:'',song:'',source:'',url:'',fileName:'',start:0,duration:12};}
  function meta(){let x={slots:Array.from({length:6},blankSlot)};try{const r=JSON.parse(localStorage.getItem(META_KEY)||'{}');if(Array.isArray(r?.slots))x.slots=Array.from({length:6},(_,i)=>({...blankSlot(),...(r.slots[i]||{})}));}catch{}return x;}
  function saveMeta(x){try{localStorage.setItem(META_KEY,JSON.stringify(x));}catch{}}
  function readyCount(){return meta().slots.filter(s=>s.configured).length;}

  function openDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE);};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
  async function putBlob(slot,file){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(file,`music-${slot}`);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};});}
  async function getBlob(slot){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),req=tx.objectStore(STORE).get(`music-${slot}`);req.onsuccess=()=>{const v=req.result;db.close();resolve(v||null);};req.onerror=()=>{db.close();reject(req.error);};});}
  async function deleteBlob(slot){try{const db=await openDb();await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(`music-${slot}`);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();}catch{}}

  function prompt(mode){return mode==='song'?'🎧 استمع للمقطع… ما اسم الأغنية؟':mode==='both'?'🎧 استمع للمقطع… من المغني وما اسم الأغنية؟':'🎧 استمع للمقطع… من المغني؟';}
  function answer(s){return s.mode==='song'?s.song:s.mode==='both'?`${s.singer} — ${s.song}`:s.singer;}

  function applyToBank(){
    if(typeof QUESTION_BANK==='undefined'||!Array.isArray(QUESTION_BANK))return;
    const cat=QUESTION_BANK.find(c=>c.id===MUSIC_ID);if(!cat)return;
    const m=meta();
    cat.desc='خمن المغني أو اسم الأغنية من المقطع الصوتي';
    cat.questions.forEach((q,i)=>{
      const s=m.slots[i];if(!s?.configured)return;
      q.q=prompt(s.mode);q.a=answer(s);q.mediaType='audio';q.media=s.source==='url'?s.url:`idb:music-${i}`;q.musicChallenge=true;q.musicSlot=i;q.musicStart=Number(s.start)||0;q.musicDuration=Math.max(6,Math.min(20,Number(s.duration)||12));
    });
  }

  function decoratePicker(){
    const count=readyCount();
    document.querySelectorAll('.pick-card').forEach(card=>{
      if(card.querySelector('.pick-name')?.textContent?.trim()!=='موسيقى')return;
      card.classList.add('music-audio-pick');let b=card.querySelector('.music-picker-audio-badge');if(!b){b=document.createElement('span');b.className='music-picker-audio-badge';card.appendChild(b);}b.textContent=count?`🎧 ${count}/6 صوت`:'🎧 خمن الصوت';
    });
  }

  function decorateStore(){
    const buy=document.querySelector('[data-premium-cat="premium-music"]');if(!buy)return;
    const card=buy.closest('.premium-cat-card');if(!card)return;
    const count=readyCount();
    let p=card.querySelector('.music-audio-progress');if(!p){p=document.createElement('div');p.className='music-audio-progress';card.querySelector('.premium-cat-info')?.appendChild(p);}if(p)p.innerHTML=`<b>🎧 ${count}/6</b><i><span style="width:${count/6*100}%"></span></i><span>مقاطع جاهزة</span>`;
    if(owned()&&!card.querySelector('.music-studio-btn')){const b=document.createElement('button');b.className='music-studio-btn';b.type='button';b.textContent='🎧 استوديو المقاطع';b.onclick=openStudio;card.appendChild(b);}
  }

  function ensureModal(){
    let m=document.getElementById('musicStudioModal');if(m)return m;
    m=document.createElement('div');m.id='musicStudioModal';m.className='modal hidden music-studio-modal';m.innerHTML='<div class="modal-card music-studio-card"><div class="music-studio-head"><div class="music-studio-title"><span>🎧</span><div><small>فئة الموسيقى</small><h3>استوديو خمن الصوت</h3></div></div><button class="music-studio-close">✕</button></div><div class="music-studio-note"><b>حقوق الاستخدام:</b> استخدم مقاطع صوت تملكها أو لديك إذن باستخدامها. الملفات التي ترفعها هنا تبقى على جهازك ولا تُرفع إلى GitHub.</div><div id="musicSlotList" class="music-slot-list"></div></div>';
    document.body.appendChild(m);m.querySelector('.music-studio-close').onclick=closeStudio;m.addEventListener('click',e=>{if(e.target===m)closeStudio();});return m;
  }

  function slotHtml(s,i){const value=VALUES[i];return `<article class="music-slot ${s.configured?'ready':''}" data-music-slot="${i}">
    <div class="music-slot-head"><div class="music-slot-title"><span class="music-slot-num">${i+1}</span><div><b>سؤال ${value} نقطة</b><small>${i%2?'السؤال الثاني':'السؤال الأول'} من مستوى ${value}</small></div></div>${s.configured?'<span class="music-ready-chip">جاهز ✓</span>':'<span class="music-empty-chip">بدون مقطع</span>'}</div>
    <div class="music-slot-grid">
      <div class="music-field"><label>نوع التحدي</label><select data-f="mode"><option value="singer" ${s.mode==='singer'?'selected':''}>من المغني؟</option><option value="song" ${s.mode==='song'?'selected':''}>اسم الأغنية؟</option><option value="both" ${s.mode==='both'?'selected':''}>المغني + الأغنية</option></select></div>
      <div class="music-field"><label>اسم المغني</label><input data-f="singer" value="${esc(s.singer)}" placeholder="مثال: اسم الفنان"></div>
      <div class="music-field"><label>اسم الأغنية</label><input data-f="song" value="${esc(s.song)}" placeholder="مثال: اسم الأغنية"></div>
      <div class="music-field wide"><label>رابط ملف صوت مباشر (اختياري)</label><input data-f="url" value="${s.source==='url'?esc(s.url):''}" placeholder="https://.../clip.mp3"></div>
      <div class="music-field"><label>بداية المقطع بالثواني</label><input data-f="start" type="number" min="0" step="1" value="${Number(s.start)||0}"></div>
      <div class="music-field"><label>مدة التشغيل</label><select data-f="duration">${[8,10,12,15,20].map(n=>`<option value="${n}" ${Number(s.duration)===n?'selected':''}>${n} ثانية</option>`).join('')}</select></div>
      <div class="music-field full"><label>أو ارفع MP3 / M4A / WAV من جهازك ${s.source==='idb'&&s.fileName?`— محفوظ: ${esc(s.fileName)}`:''}</label><input class="music-file" data-f="file" type="file" accept="audio/*"></div>
    </div>
    <div class="music-slot-actions"><button class="save" data-music-save="${i}">💾 حفظ المقطع</button><button class="test" data-music-test="${i}">▶ تجربة</button><button class="clear" data-music-clear="${i}">حذف المقطع</button></div><div class="music-test-player hidden"></div>
  </article>`;}

  function renderStudio(){const list=document.getElementById('musicSlotList');if(!list)return;const m=meta();list.innerHTML=m.slots.map(slotHtml).join('');list.querySelectorAll('[data-music-save]').forEach(b=>b.onclick=()=>saveSlot(Number(b.dataset.musicSave)));list.querySelectorAll('[data-music-test]').forEach(b=>b.onclick=()=>testSlot(Number(b.dataset.musicTest)));list.querySelectorAll('[data-music-clear]').forEach(b=>b.onclick=()=>clearSlot(Number(b.dataset.musicClear)));}
  function openStudio(){if(!owned()){typeof toast==='function'&&toast('افتح فئة الموسيقى من المتجر أولاً');return;}ensureModal();renderStudio();document.getElementById('musicStudioModal').classList.remove('hidden');}
  function closeStudio(){stopActive();document.getElementById('musicStudioModal')?.classList.add('hidden');decorateStore();applyToBank();decoratePicker();}

  function article(i){return document.querySelector(`[data-music-slot="${i}"]`);}
  function field(i,name){return article(i)?.querySelector(`[data-f="${name}"]`);}
  async function saveSlot(i){
    const a=article(i),mode=field(i,'mode')?.value||'singer',singer=field(i,'singer')?.value.trim()||'',song=field(i,'song')?.value.trim()||'',url=field(i,'url')?.value.trim()||'',file=field(i,'file')?.files?.[0],start=Math.max(0,Number(field(i,'start')?.value)||0),duration=Math.max(6,Math.min(20,Number(field(i,'duration')?.value)||12));
    if((mode==='singer'||mode==='both')&&!singer){typeof toast==='function'&&toast('اكتب اسم المغني');return;}if((mode==='song'||mode==='both')&&!song){typeof toast==='function'&&toast('اكتب اسم الأغنية');return;}
    const m=meta(),old=m.slots[i];let source=old.source,fileName=old.fileName,finalUrl=old.url;
    try{
      if(file){if(!file.type.startsWith('audio/')){toast('اختر ملف صوتي');return;}if(file.size>8*1024*1024){toast('حجم المقطع أكبر من 8MB. استخدم رابطاً مباشراً أو مقطعاً أصغر.');return;}await putBlob(i,file);source='idb';fileName=file.name;finalUrl='';}
      else if(url){await deleteBlob(i);source='url';finalUrl=url;fileName='';}
      else if(!old.configured){toast('أضف رابط صوت أو ارفع ملفاً');return;}
      m.slots[i]={configured:true,mode,singer,song,source,url:finalUrl,fileName,start,duration};saveMeta(m);applyToBank();renderStudio();decorateStore();decoratePicker();typeof toast==='function'&&toast(`🎧 تم تجهيز سؤال ${VALUES[i]} نقطة`);
    }catch{typeof toast==='function'&&toast('تعذر حفظ المقطع على الجهاز');}
  }

  async function sourceFor(i,tempFile=null,tempUrl=''){
    if(tempFile)return {src:URL.createObjectURL(tempFile),object:true};if(tempUrl)return {src:tempUrl,object:false};const s=meta().slots[i];if(!s?.configured)return null;if(s.source==='url')return {src:s.url,object:false};const blob=await getBlob(i);return blob?{src:URL.createObjectURL(blob),object:true}:null;
  }

  async function testSlot(i){
    stopActive();const a=article(i),box=a?.querySelector('.music-test-player');if(!box)return;const file=field(i,'file')?.files?.[0],url=field(i,'url')?.value.trim()||'';let src;try{src=await sourceFor(i,file,url);}catch{}if(!src){toast('احفظ أو اختر مقطعاً للتجربة');return;}box.classList.remove('hidden');box.innerHTML='<audio controls preload="metadata"></audio>';const au=box.querySelector('audio');activeAudio=au;activeObjectUrl=src.object?src.src:'';au.src=src.src;const st=Math.max(0,Number(field(i,'start')?.value)||0),dur=Math.max(6,Math.min(20,Number(field(i,'duration')?.value)||12));au.addEventListener('loadedmetadata',()=>{try{au.currentTime=Math.min(st,Math.max(0,(au.duration||st)-.1));}catch{}});au.addEventListener('timeupdate',()=>{if(au.currentTime>=st+dur){au.pause();try{au.currentTime=st;}catch{}}});au.play().catch(()=>{});
  }

  async function clearSlot(i){if(!confirm('حذف المقطع وإعدادات هذا السؤال؟'))return;stopActive();await deleteBlob(i);const m=meta();m.slots[i]=blankSlot();saveMeta(m);applyToBank();renderStudio();decorateStore();decoratePicker();toast('تم حذف المقطع');}
  function stopActive(){if(activeAudio){try{activeAudio.pause();}catch{}activeAudio=null;}if(activeObjectUrl){try{URL.revokeObjectURL(activeObjectUrl);}catch{}activeObjectUrl='';}}

  async function renderGamePlayer(q){
    const stage=document.getElementById('qMedia');if(!stage||!q?.musicChallenge)return;stopActive();let source;try{source=await sourceFor(Number(q.musicSlot));}catch{}if(!source){stage.classList.remove('show');return;}
    activeObjectUrl=source.object?source.src:'';stage.innerHTML='';stage.classList.add('show','music-audio-stage');stage.innerHTML=`<div class="music-quiz-player"><div class="music-quiz-top"><div class="music-quiz-label"><span class="music-quiz-disc">🎵</span><div><b>خمن الصوت</b><small>استمع جيداً ثم جاوب</small></div></div><span class="music-quiz-time">${q.musicDuration||12} ثانية</span></div><div class="music-wave">${Array.from({length:24},()=>'<i></i>').join('')}</div><div class="music-progress-track"><span></span></div><div class="music-quiz-actions"><button class="music-play-btn">▶ تشغيل المقطع</button><button class="music-replay-btn" title="إعادة">↻</button></div><audio preload="metadata" playsinline></audio></div>`;
    const player=stage.querySelector('.music-quiz-player'),audio=stage.querySelector('audio'),play=stage.querySelector('.music-play-btn'),replay=stage.querySelector('.music-replay-btn'),bar=stage.querySelector('.music-progress-track span');activeAudio=audio;audio.src=source.src;const start=Math.max(0,Number(q.musicStart)||0),limit=Math.max(6,Math.min(20,Number(q.musicDuration)||12));let ready=false;
    audio.addEventListener('loadedmetadata',()=>{ready=true;try{audio.currentTime=Math.min(start,Math.max(0,(audio.duration||start)-.05));}catch{}});
    const reset=()=>{try{audio.currentTime=Math.min(start,Math.max(0,(audio.duration||start)-.05));}catch{}bar.style.width='0%';};
    const doPlay=async()=>{if(!ready&&audio.readyState<1)audio.load();if(audio.currentTime<start||audio.currentTime>=start+limit-.05)reset();try{await audio.play();player.classList.add('playing');play.textContent='⏸ إيقاف المقطع';}catch{toast('اضغط تشغيل مرة ثانية للسماح بالصوت');}};
    play.onclick=()=>{if(audio.paused)doPlay();else{audio.pause();player.classList.remove('playing');play.textContent='▶ متابعة المقطع';}};replay.onclick=()=>{audio.pause();reset();doPlay();};
    audio.addEventListener('timeupdate',()=>{const elapsed=Math.max(0,audio.currentTime-start);bar.style.width=`${Math.min(100,elapsed/limit*100)}%`;if(elapsed>=limit){audio.pause();player.classList.remove('playing');play.textContent='↻ إعادة تشغيل المقطع';}});audio.addEventListener('ended',()=>{player.classList.remove('playing');play.textContent='↻ إعادة تشغيل المقطع';});audio.addEventListener('error',()=>{stage.innerHTML='<div class="music-audio-error">تعذر تشغيل المقطع. جرّب تحديث الرابط من استوديو الموسيقى.</div>';});
  }

  function wrapGame(){
    if(typeof window.openQuestion==='function'&&!window.openQuestion.__music15){const old=window.openQuestion;const fn=function(){const r=old.apply(this,arguments);if(typeof currentQuestion!=='undefined'&&currentQuestion?.musicChallenge)requestAnimationFrame(()=>renderGamePlayer(currentQuestion));return r;};fn.__music15=true;window.openQuestion=fn;}
    if(typeof window.finalizeQuestion==='function'&&!window.finalizeQuestion.__music15){const old=window.finalizeQuestion;const fn=function(){stopActive();return old.apply(this,arguments);};fn.__music15=true;window.finalizeQuestion=fn;}
    if(typeof window.renderCategoryPicker==='function'&&!window.renderCategoryPicker.__music15){const old=window.renderCategoryPicker;const fn=function(){const r=old.apply(this,arguments);requestAnimationFrame(decoratePicker);return r;};fn.__music15=true;window.renderCategoryPicker=fn;}
  }

  function setVersion(){document.title=`خلّك رائد | ${VERSION}`;const b=document.querySelector('.build-badge');if(b)b.textContent=VERSION;}
  function queueDecorate(){requestAnimationFrame(()=>{decorateStore();decoratePicker();});setTimeout(()=>{decorateStore();decoratePicker();},120);}
  function clickRoute(e){if(e.target.closest?.('#v12StoreHome,#v12StoreOpen,#storeQuick,[data-theme-action],[data-premium-cat]'))queueDecorate();}

  function init(){ensureStyles();applyToBank();wrapGame();setVersion();document.addEventListener('click',clickRoute,false);setTimeout(()=>{applyToBank();wrapGame();decoratePicker();decorateStore();setVersion();},520);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();window.addEventListener('load',()=>{applyToBank();wrapGame();decoratePicker();decorateStore();setVersion();},{once:true});
  window.RAED_MUSIC_STUDIO={open:openStudio,apply:applyToBank,readyCount};
})();