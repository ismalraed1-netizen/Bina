(function(){
  const VERSION='ARENA V14.1';
  const PROFILE_KEY='khallak_raed_profile_v12';

  const PREMIUM_CATEGORIES=[
    {id:'premium-music',name:'موسيقى',icon:'🎵',cost:160,tag:'الأكثر طلباً',desc:'آلات، مصطلحات ومعلومات موسيقية',accent:'music',questions:[
      {v:200,q:'كم عدد أوتار الجيتار القياسي عادةً؟',a:'6 أوتار'},
      {v:200,q:'أي آلة موسيقية تحتوي عادةً على 88 مفتاحاً؟',a:'البيانو'},
      {v:400,q:'ما الاسم الذي يطلق على سرعة الإيقاع في الموسيقى؟',a:'Tempo / تمبو'},
      {v:400,q:'ما أعلى طبقة صوتية نسائية شائعة في الغناء الكلاسيكي؟',a:'سوبرانو'},
      {v:600,q:'من ألّف السيمفونية الخامسة الشهيرة في دو الصغير؟',a:'لودفيغ فان بيتهوفن'},
      {v:600,q:'ما الاسم الذي يطلق على مجموعة كبيرة من العازفين يقودها قائد موسيقي؟',a:'الأوركسترا'}]},
    {id:'premium-cinema',name:'أفلام ومسلسلات',icon:'🎬',cost:220,tag:'ترفيه',desc:'سينما، تلفزيون وصناعة الشاشة',accent:'cinema',questions:[
      {v:200,q:'ما اسم الجائزة السينمائية الأمريكية الشهيرة التي تمنحها أكاديمية فنون وعلوم الصور المتحركة؟',a:'الأوسكار'},
      {v:200,q:'ما الاسم الشائع لصناعة الأفلام الهندية الناطقة بالهندية ومركزها مومباي؟',a:'بوليوود'},
      {v:400,q:'من أخرج فيلمي Titanic وAvatar؟',a:'جيمس كاميرون'},
      {v:400,q:'ما أول فيلم رسوم متحركة طويل من إنتاج ديزني؟',a:'Snow White and the Seven Dwarfs / سنو وايت والأقزام السبعة'},
      {v:600,q:'في أي مدينة فرنسية يقام مهرجان كان السينمائي؟',a:'كان'},
      {v:600,q:'ما المصطلح السينمائي الذي يصف مشهداً يُصوَّر كاملاً دون قطع ظاهر؟',a:'اللقطة الطويلة / Long Take'}]},
    {id:'premium-cars',name:'السيارات',icon:'🚗',cost:260,tag:'تحدي متخصص',desc:'شركات، موديلات وتقنيات السيارات',accent:'cars',questions:[
      {v:200,q:'أي شركة تصنع سيارة Corolla؟',a:'تويوتا'},
      {v:200,q:'أي شركة ألمانية تصنع طراز 911؟',a:'بورشه'},
      {v:400,q:'في أي دولة تأسست شركة Volvo؟',a:'السويد'},
      {v:400,q:'ماذا يعني اختصار SUV في عالم السيارات؟',a:'Sport Utility Vehicle / سيارة رياضية متعددة الاستخدامات'},
      {v:600,q:'ما اسم نظام الفرامل الذي يمنع انغلاق العجلات أثناء الكبح الشديد؟',a:'ABS'},
      {v:600,q:'ما طراز تويوتا الهجين الذي طُرح في اليابان عام 1997 واشتهر عالمياً؟',a:'Prius / بريوس'}]},
    {id:'premium-flags',name:'أعلام العالم',icon:'🏳️',cost:280,tag:'بصري',desc:'ألوان، رموز وأعلام الدول',accent:'flags',questions:[
      {v:200,q:'أي دولة يظهر في علمها قرص أحمر في المنتصف على خلفية بيضاء؟',a:'اليابان'},
      {v:200,q:'ما الرمز النباتي الموجود في وسط علم كندا؟',a:'ورقة القيقب'},
      {v:400,q:'ما العبارة البرتغالية المكتوبة على علم البرازيل؟',a:'Ordem e Progresso'},
      {v:400,q:'ما العنصران الرئيسيان الظاهران في علم المملكة العربية السعودية؟',a:'الشهادة والسيف'},
      {v:600,q:'ما الدولة صاحبة العلم الوطني الوحيد غير رباعي الأضلاع؟',a:'نيبال'},
      {v:600,q:'إلى جانب سويسرا، ما الدولة الأخرى التي يكون علمها الوطني مربع الشكل؟',a:'الفاتيكان'}]},
    {id:'premium-logos',name:'شعارات وعلامات',icon:'🏷️',cost:320,tag:'تخمين',desc:'شعارات أشهر العلامات العالمية',accent:'logos',questions:[
      {v:200,q:'أي شركة تقنية عالمية يرتبط شعارها بتفاحة مقضومة؟',a:'Apple / آبل'},
      {v:200,q:'أي سلسلة مطاعم عالمية تشتهر بقوسين ذهبيين على شكل حرف M؟',a:'McDonald’s / ماكدونالدز'},
      {v:400,q:'أي علامة رياضية تستخدم شعار Swoosh الشهير؟',a:'Nike / نايكي'},
      {v:400,q:'أي علامة رياضية عالمية ترتبط بثلاثة خطوط متوازية؟',a:'Adidas / أديداس'},
      {v:600,q:'أي شركة سيارات تستخدم أربع حلقات متداخلة في شعارها؟',a:'Audi / أودي'},
      {v:600,q:'أي شركة سيارات رياضية إيطالية يرتبط شعارها بحصان جامح؟',a:'Ferrari / فيراري'}]}
  ];

  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function readProfile(){
    let p={};try{p=JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}')||{};}catch{}
    if(!Array.isArray(p.ownedCategories))p.ownedCategories=[];
    p.coins=Number(p.coins)||0;
    return p;
  }
  function saveProfile(p){try{localStorage.setItem(PROFILE_KEY,JSON.stringify(p));}catch{}}
  function cloneCat(cat){return {id:cat.id,name:cat.name,icon:cat.icon,desc:cat.desc,premium:true,questions:cat.questions.map(q=>({...q}))};}

  function syncUnlocked(){
    if(typeof QUESTION_BANK==='undefined'||!Array.isArray(QUESTION_BANK))return;
    const owned=new Set(readProfile().ownedCategories);
    PREMIUM_CATEGORIES.forEach(cat=>{if(owned.has(cat.id)&&!QUESTION_BANK.some(x=>x.id===cat.id))QUESTION_BANK.push(cloneCat(cat));});
  }

  function storeMarkup(){
    const p=readProfile(),owned=new Set(p.ownedCategories);
    return `<section id="premiumCategoryStore" class="premium-category-store">
      <div class="premium-store-head"><div><span>إضافات اللعبة</span><h4>فئات المتجر</h4><p>اشترِ الفئة مرة واحدة وتظهر بعدها مع الفئات في كل مباراة.</p></div><div class="premium-store-count"><strong>${owned.size}/5</strong><small>فئات مفتوحة</small></div></div>
      <div class="premium-cat-grid">${PREMIUM_CATEGORIES.map(cat=>{const has=owned.has(cat.id);return `<article class="premium-cat-card ${has?'owned':''} ${cat.accent}"><div class="premium-cat-art"><span>${cat.icon}</span><em>${esc(cat.tag)}</em></div><div class="premium-cat-info"><div class="premium-cat-title"><b>${esc(cat.name)}</b>${has?'<span class="owned-chip">مفتوحة ✓</span>':'<span class="premium-chip">PREMIUM</span>'}</div><p>${esc(cat.desc)}</p><div class="premium-cat-meta"><span>6 أسئلة</span><span>200 • 400 • 600</span></div></div><button class="premium-cat-buy" data-premium-cat="${cat.id}" ${has?'disabled':''}>${has?'مملوكة':`${cat.cost} 🪙 شراء`}</button></article>`;}).join('')}</div>
    </section>`;
  }

  function bindStoreButtons(root=document){
    root.querySelectorAll?.('[data-premium-cat]').forEach(btn=>{if(btn.dataset.boundPremium==='1')return;btn.dataset.boundPremium='1';btn.onclick=()=>buyCategory(btn.dataset.premiumCat);});
  }

  function enhanceStore(){
    const modal=document.getElementById('v12Modal');
    if(!modal||modal.classList.contains('hidden'))return;
    const title=modal.querySelector('#v12ModalTitle')?.textContent||'';
    if(!title.includes('متجر'))return;
    const body=modal.querySelector('#v12ModalBody');if(!body)return;
    if(!body.querySelector('#premiumCategoryStore'))body.insertAdjacentHTML('beforeend',storeMarkup());
    const wallet=body.querySelector('.store-wallet b'),coins=readProfile().coins;
    if(wallet&&wallet.textContent!==`${coins} 🪙`)wallet.textContent=`${coins} 🪙`;
    bindStoreButtons(body);
  }

  function queueStoreEnhance(){
    requestAnimationFrame(enhanceStore);
    setTimeout(enhanceStore,80);
  }

  function buyCategory(id){
    const cat=PREMIUM_CATEGORIES.find(x=>x.id===id);if(!cat)return;
    if(typeof state!=='undefined'&&state?.stage==='game'){if(typeof toast==='function')toast('اشترِ الفئات قبل بدء المباراة أو بعد انتهائها');return;}
    const p=readProfile();if(p.ownedCategories.includes(id))return;
    if(p.coins<cat.cost){if(typeof toast==='function')toast(`تحتاج ${cat.cost-p.coins} عملة إضافية لفتح ${cat.name}`);return;}
    p.coins-=cat.cost;p.ownedCategories.push(id);saveProfile(p);syncUnlocked();
    if(typeof toast==='function')toast(`🎁 تم فتح فئة ${cat.name}!`);
    const section=document.getElementById('premiumCategoryStore');if(section)section.outerHTML=storeMarkup();
    bindStoreButtons(document);
    /* إعادة واحدة فقط بعد الشراء لتزامن رصيد V12 داخل الذاكرة، وليست أثناء فتح الموقع. */
    setTimeout(()=>location.reload(),350);
  }

  function decoratePicker(){
    const owned=new Set(readProfile().ownedCategories);
    document.querySelectorAll('.pick-card').forEach(card=>{
      const name=card.querySelector('.pick-name')?.textContent?.trim();
      const cat=PREMIUM_CATEGORIES.find(x=>x.name===name);if(!cat)return;
      if(!owned.has(cat.id)){card.remove();return;}
      card.classList.add('premium-owned-pick');
      if(!card.querySelector('.premium-picker-badge'))card.insertAdjacentHTML('afterbegin','<span class="premium-picker-badge">مشتراة ⭐</span>');
    });
  }

  function wrapPicker(){
    if(typeof window.renderCategoryPicker==='function'&&!window.renderCategoryPicker.__premium141){
      const old=window.renderCategoryPicker;
      const fn=function(){const r=old.apply(this,arguments);requestAnimationFrame(decoratePicker);return r;};
      fn.__premium141=true;window.renderCategoryPicker=fn;
    }
  }

  function setVersion(){
    const title=`خلّك رائد | ${VERSION}`;if(document.title!==title)document.title=title;
    const badge=document.querySelector('.build-badge');if(badge&&badge.textContent!==VERSION)badge.textContent=VERSION;
  }

  function clickRouter(e){
    const el=e.target.closest?.('#v12StoreHome,#v12StoreOpen,#storeQuick,[data-theme-action]');
    if(el)queueStoreEnhance();
  }

  function init(){
    syncUnlocked();wrapPicker();setVersion();
    document.addEventListener('click',clickRouter,false);
    setTimeout(()=>{syncUnlocked();decoratePicker();wrapPicker();setVersion();},420);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.addEventListener('load',()=>{syncUnlocked();decoratePicker();setVersion();},{once:true});
  window.RAED_PREMIUM_CATEGORIES=PREMIUM_CATEGORIES;
})();