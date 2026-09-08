const CUSTOM_BANK_KEY='khallak_raed_custom_bank_v1';
const MEDIA_TYPES={text:{label:'سؤال نصي',icon:'📝'},image:{label:'صورة',icon:'🖼️'},logo:{label:'شعار',icon:'🏷️'},zoom:{label:'زووم',icon:'🔎'},audio:{label:'خمن الصوت',icon:'🎧'},video:{label:'فيديو',icon:'🎬'}};
let customBank=[];
let editingQuestion=null;
let activeZoom=2.6;

(function initRaedStudio(){
  injectAdminStyles();
  loadCustomBank();
  syncCustomBankToGame();
  injectAdminButton();
  injectMediaStage();
  injectAdminModal();
  bindAdminEvents();
  wrapGameMediaHooks();
})();

function injectAdminStyles(){
  if(document.querySelector('link[href="admin.css"]'))return;
  const link=document.createElement('link');link.rel='stylesheet';link.href='admin.css';document.head.appendChild(link);
}

function loadCustomBank(){
  try{
    const raw=localStorage.getItem(CUSTOM_BANK_KEY);
    const parsed=raw?JSON.parse(raw):[];
    customBank=Array.isArray(parsed)?parsed.map(normalizeCategory):[];
  }catch{customBank=[];}
}

function normalizeCategory(cat){
  return {
    id:String(cat.id||`custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`),
    name:String(cat.name||'فئة جديدة').slice(0,40),
    icon:String(cat.icon||'🎯').slice(0,8),
    desc:String(cat.desc||'فئة مضافة من لوحة الإدارة').slice(0,120),
    custom:true,
    questions:Array.isArray(cat.questions)?cat.questions.slice(0,6).map(normalizeQuestion):[]
  };
}

function normalizeQuestion(q){
  const type=MEDIA_TYPES[q.mediaType]?q.mediaType:'text';
  const val=[200,400,600].includes(Number(q.v))?Number(q.v):200;
  return {v:val,q:String(q.q||'').slice(0,260),a:String(q.a||'').slice(0,200),mediaType:type,media:String(q.media||''),zoom:Number(q.zoom)||2.6};
}

function saveCustomBank(){
  try{localStorage.setItem(CUSTOM_BANK_KEY,JSON.stringify(customBank));return true;}
  catch{toast('تعذر الحفظ. جرّب روابط للوسائط بدل رفع ملفات كبيرة.');return false;}
}

function syncCustomBankToGame(){
  for(let i=QUESTION_BANK.length-1;i>=0;i--)if(QUESTION_BANK[i]?.custom)QUESTION_BANK.splice(i,1);
  customBank.filter(c=>c.questions.length===6).forEach(c=>QUESTION_BANK.push(deepCopy(c)));
}

function injectAdminButton(){
  const actions=document.querySelector('.top-actions');if(!actions||document.getElementById('adminBtn'))return;
  const btn=document.createElement('button');btn.id='adminBtn';btn.className='icon-btn admin-top-btn';btn.title='إدارة الفئات والأسئلة';btn.textContent='🛠️';actions.prepend(btn);
}

function injectMediaStage(){
  const qText=document.getElementById('qText');if(!qText||document.getElementById('qMedia'))return;
  const stage=document.createElement('div');stage.id='qMedia';stage.className='media-stage';
  qText.parentNode.insertBefore(stage,qText);
}

function injectAdminModal(){
  if(document.getElementById('adminModal'))return;
  const wrap=document.createElement('div');wrap.id='adminModal';wrap.className='modal admin-modal hidden';
  wrap.innerHTML=`<div class="modal-card glass admin-card">
    <div class="admin-head"><div><h2>🛠️ استوديو خلّك رائد</h2><p>أضف فئات وأسئلة صور وشعارات وصوت وفيديو بدون تعديل الكود.</p></div><button id="closeAdminBtn" class="icon-btn">✕</button></div>
    <div class="admin-toolbar"><div class="admin-stats"><span class="admin-stat">الفئات المخصصة: <strong id="adminCatCount">0</strong></span><span class="admin-stat">الجاهزة للعب: <strong id="adminReadyCount">0</strong></span><span class="admin-stat">الأسئلة: <strong id="adminQCount">0</strong></span></div><div class="admin-actions"><button id="exportBankBtn" class="btn ghost small">⬇️ تصدير JSON</button><label class="btn ghost small admin-file-label">⬆️ استيراد JSON<input id="importBankInput" type="file" accept="application/json,.json"></label><button id="clearBankBtn" class="btn red small">حذف المخصص</button></div></div>
    <div class="admin-grid">
      <div class="admin-section"><h3>إنشاء فئة</h3><div class="admin-section-sub">كل فئة تصبح متاحة للعب بعد اكتمال 6 أسئلة.</div><div class="admin-form-grid">
        <div class="admin-field"><label>اسم الفئة</label><input id="adminCatName" class="admin-input" maxlength="40" placeholder="مثال: شعارات عالمية"></div>
        <div class="admin-field"><label>الأيقونة</label><input id="adminCatIcon" class="admin-input" maxlength="8" value="🎯"></div>
        <div class="admin-field full"><label>وصف قصير</label><input id="adminCatDesc" class="admin-input" maxlength="120" placeholder="ما نوع الأسئلة في هذه الفئة؟"></div>
      </div><div class="admin-actions"><button id="addCategoryBtn" class="btn small">+ إضافة الفئة</button></div>
      <div class="admin-note">💾 البيانات المضافة تُحفظ في هذا المتصفح فقط. استخدم التصدير لعمل نسخة احتياطية أو لنقل بنك الأسئلة لجهاز آخر.</div></div>

      <div class="admin-section"><h3 id="questionFormTitle">إضافة سؤال</h3><div class="admin-section-sub">اختر النوع، ويمكنك استخدام رابط مباشر للوسائط أو رفع ملف صغير من جهازك.</div><div class="admin-form-grid">
        <div class="admin-field"><label>الفئة</label><select id="adminQuestionCategory" class="admin-select"></select></div>
        <div class="admin-field"><label>قيمة السؤال</label><select id="adminQuestionValue" class="admin-select"><option value="200">200</option><option value="400">400</option><option value="600">600</option></select></div>
        <div class="admin-field"><label>نوع السؤال</label><select id="adminMediaType" class="admin-select"><option value="text">📝 نصي</option><option value="image">🖼️ صورة</option><option value="logo">🏷️ شعار</option><option value="zoom">🔎 زووم</option><option value="audio">🎧 خمن الصوت</option><option value="video">🎬 فيديو</option></select></div>
        <div id="zoomField" class="admin-field hidden"><label>درجة الزووم</label><input id="adminZoom" class="admin-input" type="number" min="1.2" max="5" step="0.2" value="2.6"></div>
        <div class="admin-field full"><label>السؤال</label><textarea id="adminQuestionText" class="admin-textarea" maxlength="260" placeholder="اكتب السؤال هنا..."></textarea></div>
        <div class="admin-field full"><label>الإجابة</label><input id="adminAnswer" class="admin-input" maxlength="200" placeholder="الإجابة الصحيحة"></div>
        <div id="mediaUrlField" class="admin-field full hidden"><label>رابط الصورة / الصوت / الفيديو</label><input id="adminMediaUrl" class="admin-input" placeholder="https://..."></div>
        <div id="mediaFileField" class="admin-field full hidden"><label>أو ارفع ملفاً صغيراً (حد أقصى 2.5MB)</label><input id="adminMediaFile" class="admin-input" type="file" accept="image/*,audio/*,video/*"></div>
      </div>
      <div id="adminPreview" class="admin-preview"></div>
      <div class="admin-actions"><button id="previewMediaBtn" class="btn ghost small hidden">👁 معاينة الوسائط</button><button id="saveQuestionBtn" class="btn green small">+ حفظ السؤال</button><button id="cancelEditBtn" class="btn ghost small hidden">إلغاء التعديل</button></div></div>
    </div>

    <div class="admin-section" style="margin-top:13px"><div class="admin-toolbar"><div><h3 style="margin:0">بنك الأسئلة المخصص</h3><div class="admin-section-sub" style="margin:3px 0 0">الفئة المكتملة 6/6 تظهر تلقائياً في شاشة اختيار الفئات.</div></div></div><div id="adminBankList" class="admin-list"></div></div>
  </div>`;
  document.body.appendChild(wrap);
}

function bindAdminEvents(){
  document.getElementById('adminBtn')?.addEventListener('click',openAdmin);
  document.getElementById('closeAdminBtn')?.addEventListener('click',closeAdmin);
  document.getElementById('adminModal')?.addEventListener('click',e=>{if(e.target.id==='adminModal')closeAdmin();});
  document.getElementById('addCategoryBtn')?.addEventListener('click',addCategory);
  document.getElementById('adminMediaType')?.addEventListener('change',syncMediaFields);
  document.getElementById('saveQuestionBtn')?.addEventListener('click',saveQuestionFromForm);
  document.getElementById('cancelEditBtn')?.addEventListener('click',resetQuestionForm);
  document.getElementById('previewMediaBtn')?.addEventListener('click',previewAdminMedia);
  document.getElementById('exportBankBtn')?.addEventListener('click',exportBank);
  document.getElementById('importBankInput')?.addEventListener('change',importBank);
  document.getElementById('clearBankBtn')?.addEventListener('click',clearCustomBank);
}

function openAdmin(){renderAdmin();document.getElementById('adminModal').classList.remove('hidden');}
function closeAdmin(){document.getElementById('adminModal').classList.add('hidden');resetQuestionForm();}

function renderAdmin(){
  const total=customBank.reduce((n,c)=>n+c.questions.length,0);
  document.getElementById('adminCatCount').textContent=customBank.length;
  document.getElementById('adminReadyCount').textContent=customBank.filter(c=>c.questions.length===6).length;
  document.getElementById('adminQCount').textContent=total;
  const sel=document.getElementById('adminQuestionCategory');const previous=sel.value;sel.innerHTML='';
  customBank.forEach(c=>{const o=document.createElement('option');o.value=c.id;o.textContent=`${c.icon} ${c.name} (${c.questions.length}/6)`;sel.appendChild(o);});
  if(previous&&customBank.some(c=>c.id===previous))sel.value=previous;
  const list=document.getElementById('adminBankList');list.innerHTML='';
  if(!customBank.length){list.innerHTML='<div class="admin-empty">ما أضفت أي فئة حتى الآن. أنشئ أول فئة وابدأ ببناء أسئلتك ✨</div>';return;}
  customBank.forEach(cat=>{
    const box=document.createElement('div');box.className='admin-category';
    const ready=cat.questions.length===6;
    box.innerHTML=`<div class="admin-category-head"><div class="admin-category-title"><span>${escapeHtml(cat.icon)}</span><div><b>${escapeHtml(cat.name)}</b><small>${escapeHtml(cat.desc)}</small></div></div><div style="display:flex;align-items:center;gap:6px"><span class="admin-progress ${ready?'ready':''}">${cat.questions.length}/6 ${ready?'جاهزة':'غير مكتملة'}</span><button class="admin-icon-btn danger" data-delete-cat="${escapeHtml(cat.id)}">حذف</button></div></div>`;
    const qList=document.createElement('div');qList.className='admin-question-list';
    if(!cat.questions.length)qList.innerHTML='<div class="admin-empty" style="padding:16px">أضف 6 أسئلة لهذه الفئة.</div>';
    cat.questions.forEach((q,idx)=>{
      const row=document.createElement('div');row.className='admin-q';
      row.innerHTML=`<div class="admin-q-type">${MEDIA_TYPES[q.mediaType]?.icon||'📝'}</div><div class="admin-q-main"><b>${escapeHtml(q.q)}</b><small>${q.v} نقطة • ${MEDIA_TYPES[q.mediaType]?.label||'نصي'}</small></div><div class="admin-q-actions"><button data-edit-q="${escapeHtml(cat.id)}:${idx}">تعديل</button><button class="admin-icon-btn danger" data-delete-q="${escapeHtml(cat.id)}:${idx}">حذف</button></div>`;
      qList.appendChild(row);
    });
    box.appendChild(qList);list.appendChild(box);
  });
  list.querySelectorAll('[data-delete-cat]').forEach(b=>b.onclick=()=>deleteCategory(b.dataset.deleteCat));
  list.querySelectorAll('[data-delete-q]').forEach(b=>b.onclick=()=>{const [id,idx]=b.dataset.deleteQ.split(':');deleteQuestion(id,Number(idx));});
  list.querySelectorAll('[data-edit-q]').forEach(b=>b.onclick=()=>{const [id,idx]=b.dataset.editQ.split(':');editQuestion(id,Number(idx));});
}

function addCategory(){
  const name=document.getElementById('adminCatName').value.trim();if(!name){toast('اكتب اسم الفئة أولاً');return;}
  const cat={id:`custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`,name,icon:document.getElementById('adminCatIcon').value.trim()||'🎯',desc:document.getElementById('adminCatDesc').value.trim()||'فئة مضافة من لوحة الإدارة',custom:true,questions:[]};
  customBank.push(cat);saveCustomBank();syncCustomBankToGame();document.getElementById('adminCatName').value='';document.getElementById('adminCatDesc').value='';renderAdmin();toast('تم إنشاء الفئة ✅');
}

function syncMediaFields(){
  const type=document.getElementById('adminMediaType').value;const needs=type!=='text';
  document.getElementById('mediaUrlField').classList.toggle('hidden',!needs);document.getElementById('mediaFileField').classList.toggle('hidden',!needs);document.getElementById('previewMediaBtn').classList.toggle('hidden',!needs);document.getElementById('zoomField').classList.toggle('hidden',type!=='zoom');document.getElementById('adminMediaFile').accept=type==='audio'?'audio/*':type==='video'?'video/*':'image/*';document.getElementById('adminPreview').classList.remove('show');
}

async function saveQuestionFromForm(){
  if(!customBank.length){toast('أنشئ فئة أولاً');return;}
  const catId=document.getElementById('adminQuestionCategory').value;const cat=customBank.find(c=>c.id===catId);if(!cat){toast('اختر فئة صحيحة');return;}
  const text=document.getElementById('adminQuestionText').value.trim(),answer=document.getElementById('adminAnswer').value.trim();if(!text||!answer){toast('اكتب السؤال والإجابة');return;}
  if(!editingQuestion&&cat.questions.length>=6){toast('هذه الفئة مكتملة بـ 6 أسئلة');return;}
  const mediaType=document.getElementById('adminMediaType').value;let media='';
  if(mediaType!=='text'){
    const file=document.getElementById('adminMediaFile').files[0];const url=document.getElementById('adminMediaUrl').value.trim();
    if(file){if(file.size>2.5*1024*1024){toast('الملف أكبر من 2.5MB. استخدم رابطاً للملف.');return;}media=await readAsDataUrl(file);}else media=url;
    if(!media){toast('أضف رابط الوسائط أو ارفع ملفاً');return;}
  }
  const q=normalizeQuestion({v:Number(document.getElementById('adminQuestionValue').value),q:text,a:answer,mediaType,media,zoom:Number(document.getElementById('adminZoom').value)||2.6});
  if(editingQuestion){
    const oldCat=customBank.find(c=>c.id===editingQuestion.catId);if(!oldCat)return;
    if(editingQuestion.catId===catId){oldCat.questions[editingQuestion.index]=q;}else{if(cat.questions.length>=6){toast('الفئة الجديدة مكتملة');return;}oldCat.questions.splice(editingQuestion.index,1);cat.questions.push(q);}
    toast('تم تحديث السؤال ✅');
  }else{cat.questions.push(q);toast('تمت إضافة السؤال ✅');}
  saveCustomBank();syncCustomBankToGame();resetQuestionForm();renderAdmin();
}

function editQuestion(catId,index){
  const cat=customBank.find(c=>c.id===catId),q=cat?.questions[index];if(!q)return;editingQuestion={catId,index};document.getElementById('questionFormTitle').textContent='تعديل السؤال';document.getElementById('adminQuestionCategory').value=catId;document.getElementById('adminQuestionValue').value=String(q.v);document.getElementById('adminMediaType').value=q.mediaType;document.getElementById('adminQuestionText').value=q.q;document.getElementById('adminAnswer').value=q.a;document.getElementById('adminMediaUrl').value=q.media?.startsWith('data:')?'':q.media;document.getElementById('adminZoom').value=String(q.zoom||2.6);document.getElementById('cancelEditBtn').classList.remove('hidden');document.getElementById('saveQuestionBtn').textContent='💾 حفظ التعديل';syncMediaFields();document.querySelector('.admin-card').scrollTo({top:250,behavior:'smooth'});
}

function resetQuestionForm(){
  editingQuestion=null;const ids=['adminQuestionText','adminAnswer','adminMediaUrl'];ids.forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});const file=document.getElementById('adminMediaFile');if(file)file.value='';const t=document.getElementById('adminMediaType');if(t)t.value='text';const z=document.getElementById('adminZoom');if(z)z.value='2.6';document.getElementById('questionFormTitle').textContent='إضافة سؤال';document.getElementById('cancelEditBtn').classList.add('hidden');document.getElementById('saveQuestionBtn').textContent='+ حفظ السؤال';document.getElementById('adminPreview').classList.remove('show');syncMediaFields();
}

function deleteCategory(id){if(!confirm('حذف الفئة وكل أسئلتها؟'))return;customBank=customBank.filter(c=>c.id!==id);saveCustomBank();syncCustomBankToGame();renderAdmin();toast('تم حذف الفئة');}
function deleteQuestion(id,index){if(!confirm('حذف هذا السؤال؟'))return;const cat=customBank.find(c=>c.id===id);if(!cat)return;cat.questions.splice(index,1);saveCustomBank();syncCustomBankToGame();renderAdmin();toast('تم حذف السؤال');}

async function previewAdminMedia(){
  const type=document.getElementById('adminMediaType').value;let media=document.getElementById('adminMediaUrl').value.trim();const file=document.getElementById('adminMediaFile').files[0];if(file){if(file.size>2.5*1024*1024){toast('الملف أكبر من 2.5MB');return;}media=await readAsDataUrl(file);}if(!media){toast('أضف رابطاً أو ملفاً للمعاينة');return;}
  const p=document.getElementById('adminPreview');p.innerHTML='';const q={mediaType:type,media,zoom:Number(document.getElementById('adminZoom').value)||2.6};renderMediaInto(p,q,true);p.classList.add('show');
}

function exportBank(){
  const payload={version:1,exportedAt:new Date().toISOString(),categories:customBank};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`khallak-raed-bank-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);toast('تم تصدير بنك الأسئلة');
}

async function importBank(e){
  const file=e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());const cats=Array.isArray(data)?data:data.categories;if(!Array.isArray(cats))throw new Error();const normalized=cats.map(normalizeCategory);if(!confirm(`استيراد ${normalized.length} فئة؟ سيستبدل البنك المخصص الحالي.`))return;customBank=normalized;saveCustomBank();syncCustomBankToGame();renderAdmin();toast('تم الاستيراد بنجاح ✅');}catch{toast('ملف JSON غير صالح');}finally{e.target.value='';}
}

function clearCustomBank(){if(!customBank.length)return;if(!confirm('حذف جميع الفئات والأسئلة المخصصة من هذا الجهاز؟'))return;customBank=[];saveCustomBank();syncCustomBankToGame();renderAdmin();toast('تم حذف البنك المخصص');}
function readAsDataUrl(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=reject;r.readAsDataURL(file);});}

function wrapGameMediaHooks(){
  const originalOpen=openQuestion;openQuestion=function(catId,index){originalOpen(catId,index);if(currentQuestion)renderQuestionMedia(currentQuestion);};
  const originalFinalize=finalizeQuestion;finalizeQuestion=function(...args){stopQuestionMedia();clearQuestionMedia();return originalFinalize(...args);};
  const originalTie=startTieBreaker;startTieBreaker=function(...args){clearQuestionMedia();return originalTie(...args);};
}

function renderQuestionMedia(q){
  const stage=document.getElementById('qMedia');if(!stage)return;stage.innerHTML='';stage.classList.remove('show');if(!q.mediaType||q.mediaType==='text'||!q.media)return;renderMediaInto(stage,q,false);stage.classList.add('show');
}

function renderMediaInto(root,q,preview){
  root.innerHTML='';const kind=document.createElement('div');kind.className='media-kind';kind.textContent=`${MEDIA_TYPES[q.mediaType]?.icon||'✨'} ${MEDIA_TYPES[q.mediaType]?.label||'وسائط'}`;root.appendChild(kind);
  const frame=document.createElement('div');frame.className=`media-frame ${q.mediaType==='logo'?'logo':''} ${q.mediaType==='zoom'?'zoom':''}`;root.appendChild(frame);
  if(q.mediaType==='image'||q.mediaType==='logo'||q.mediaType==='zoom'){
    const img=document.createElement('img');img.alt='وسائط السؤال';img.src=q.media;img.onerror=()=>{frame.innerHTML='<div class="media-error">تعذر تحميل الصورة</div>';};frame.appendChild(img);
    if(q.mediaType==='zoom'){
      activeZoom=Number(q.zoom)||2.6;img.style.transform=`scale(${activeZoom})`;
      const controls=document.createElement('div');controls.className='zoom-controls';const less=document.createElement('button');less.textContent='−';less.title='كشف جزء أكبر من الصورة';const more=document.createElement('button');more.textContent='+';more.title='تكبير الصورة';less.onclick=()=>{activeZoom=Math.max(1,activeZoom-.35);img.style.transform=`scale(${activeZoom})`;};more.onclick=()=>{activeZoom=Math.min(5,activeZoom+.35);img.style.transform=`scale(${activeZoom})`;};controls.append(less,more);frame.appendChild(controls);
    }
  }else if(q.mediaType==='audio'){
    const audio=document.createElement('audio');audio.controls=true;audio.preload='metadata';audio.src=q.media;frame.appendChild(audio);
  }else if(q.mediaType==='video'){
    const yt=toYouTubeEmbed(q.media);if(yt){const iframe=document.createElement('iframe');iframe.src=yt;iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';iframe.allowFullscreen=true;frame.appendChild(iframe);}else{const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.src=q.media;frame.appendChild(video);}
  }
  if(preview)frame.style.minHeight='120px';
}

function toYouTubeEmbed(url){
  try{const u=new URL(url);let id='';if(u.hostname.includes('youtu.be'))id=u.pathname.slice(1);else if(u.hostname.includes('youtube.com')){if(u.pathname.startsWith('/shorts/'))id=u.pathname.split('/')[2];else id=u.searchParams.get('v')||'';}return id?`https://www.youtube.com/embed/${encodeURIComponent(id)}`:'';}catch{return '';}
}

function stopQuestionMedia(){document.querySelectorAll('#qMedia audio,#qMedia video').forEach(m=>{try{m.pause();}catch{}});}
function clearQuestionMedia(){const s=document.getElementById('qMedia');if(s){s.innerHTML='';s.classList.remove('show');}}
