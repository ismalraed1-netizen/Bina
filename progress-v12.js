(function(){
  const VERSION='ARENA V12';
  const PROFILE_KEY='khallak_raed_profile_v12';
  const RISK_KEY='khallak_raed_risk_v12';
  const LOGO='logo-raed.svg';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  const THEMES=[
    {id:'classic',name:'الساحة الأصلية',icon:'👑',cost:0,desc:'بنفسجي × أزرق × ذهبي',tag:'مجاني'},
    {id:'royal',name:'الملكي',icon:'💎',cost:300,desc:'ذهبي فاخر مع بنفسجي عميق'},
    {id:'ember',name:'الجمر',icon:'🔥',cost:420,desc:'أحمر ناري وبرتقالي للمواجهات الحماسية'},
    {id:'cyber',name:'سايبر',icon:'⚡',cost:520,desc:'سماوي نيون وأزرق إلكتروني'},
    {id:'emerald',name:'الزمرد',icon:'🟢',cost:380,desc:'أخضر زمردي مع ذهبي هادئ'}
  ];

  const freshProfile=()=>({xp:0,coins:180,matches:0,cups:0,cupProgress:0,owned:['classic'],theme:'classic',processed:[],title:'المتحدي'});
  function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;}}
  function loadProfile(){const p={...freshProfile(),...read(PROFILE_KEY,freshProfile())};if(!Array.isArray(p.owned))p.owned=['classic'];if(!p.owned.includes('classic'))p.owned.unshift('classic');if(!Array.isArray(p.processed))p.processed=[];return p;}
  let profile=loadProfile();
  function saveProfile(){localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));}
  function level(){return Math.max(1,Math.floor(profile.xp/500)+1);}
  function levelProgress(){return Math.round((profile.xp%500)/500*100);}
  function titleForLevel(l){if(l>=20)return 'أسطورة المعرفة';if(l>=15)return 'الرائد الذهبي';if(l>=10)return 'قائد الساحة';if(l>=6)return 'خبير التحدي';if(l>=3)return 'منافس شرس';return 'المتحدي';}
  function applyTitle(){profile.title=titleForLevel(level());saveProfile();}

  function loadRisk(){const base={matchId:null,used:[false,false],armed:null};const r={...base,...read(RISK_KEY,base)};if(!Array.isArray(r.used)||r.used.length!==2)r.used=[false,false];return r;}
  let risk=loadRisk();
  function saveRisk(){localStorage.setItem(RISK_KEY,JSON.stringify(risk));}
  function ensureRiskMatch(){const id=(typeof state!=='undefined'&&state?.startedAt)||null;if(id&&risk.matchId!==id){risk={matchId:id,used:[false,false],armed:null};saveRisk();}}

  function applyVersion(){
    document.title=`خلّك رائد | ${VERSION}`;
    const badge=document.querySelector('.build-badge');if(badge)badge.textContent=VERSION;
    const fav=document.querySelector('link[rel="icon"]');if(fav)fav.href=`${LOGO}?v=12`;
    document.body.dataset.raedTheme=profile.theme||'classic';
    applyTitle();
    injectProfileButton();injectHomeProgress();injectGameDock();injectWinnerXp();
  }

  function ensureModal(){
    let m=document.getElementById('v12Modal');if(m)return m;
    m=document.createElement('div');m.id='v12Modal';m.className='modal hidden v12-modal';
    m.innerHTML=`<div class="modal-card v12-modal-card"><div class="v12-modal-head"><div class="v12-modal-brand"><img src="${LOGO}" alt=""><div><span>خلّك رائد • V12</span><h3 id="v12ModalTitle">ملف الرائد</h3></div></div><button id="v12ModalClose">✕</button></div><div id="v12ModalBody"></div></div>`;
    document.body.appendChild(m);m.querySelector('#v12ModalClose').onclick=()=>m.classList.add('hidden');m.addEventListener('click',e=>{if(e.target===m)m.classList.add('hidden');});return m;
  }
  function openModal(title,html){const m=ensureModal();m.querySelector('#v12ModalTitle').textContent=title;m.querySelector('#v12ModalBody').innerHTML=html;m.classList.remove('hidden');return m;}

  function injectProfileButton(){
    const top=document.querySelector('.top-actions');if(!top)return;
    let b=document.getElementById('profileV12Btn');
    if(!b){b=document.createElement('button');b.id='profileV12Btn';b.className='icon-btn v12-profile-btn';b.title='ملف الرائد';b.onclick=showProfile;top.prepend(b);}
    b.innerHTML=`<span>⭐</span><small>Lv.${level()}</small>`;
  }

  function profileCard(){
    return `<div class="v12-profile-hero"><div class="v12-profile-logo"><img src="${LOGO}" alt=""></div><div class="v12-profile-copy"><span>${esc(profile.title)}</span><h2>المستوى ${level()}</h2><p>${profile.xp} XP • ${profile.coins} عملة</p><div class="v12-xp"><i style="width:${levelProgress()}%"></i></div><small>${profile.xp%500} / 500 XP للمستوى التالي</small></div></div>
    <div class="v12-profile-stats"><div><strong>${profile.matches}</strong><span>مباراة مكتملة</span></div><div><strong>${profile.cups}</strong><span>كأس ساحة</span></div><div><strong>${profile.owned.length}</strong><span>ثيمات مفتوحة</span></div><div><strong>${profile.coins}</strong><span>عملات</span></div></div>
    <div class="v12-profile-actions"><button id="v12StoreOpen" class="v12-action gold">🏪 متجر الثيمات</button><button id="v12CupOpen" class="v12-action">🏆 كأس الساحة</button></div>`;
  }
  function showProfile(){const m=openModal('ملف الرائد',profileCard());m.querySelector('#v12StoreOpen').onclick=showStore;m.querySelector('#v12CupOpen').onclick=showCup;}

  function showStore(){
    const cards=THEMES.map(t=>{const owned=profile.owned.includes(t.id),active=profile.theme===t.id;return `<article class="theme-card ${active?'active':''}" data-theme="${t.id}"><div class="theme-preview ${t.id}"><span>${t.icon}</span></div><div class="theme-info"><b>${esc(t.name)}</b><p>${esc(t.desc)}</p><small>${owned?(active?'مفعّل':'مملوك'):`${t.cost} 🪙`}</small></div><button class="theme-buy" data-theme-action="${t.id}" ${active?'disabled':''}>${active?'مفعّل ✓':owned?'استخدام':'شراء'}</button></article>`}).join('');
    const m=openModal('متجر الثيمات',`<div class="store-wallet"><span>رصيدك</span><b>${profile.coins} 🪙</b></div><div class="theme-grid">${cards}</div>`);
    m.querySelectorAll('[data-theme-action]').forEach(btn=>btn.onclick=()=>buyOrEquip(btn.dataset.themeAction));
  }
  function buyOrEquip(id){const t=THEMES.find(x=>x.id===id);if(!t)return;if(!profile.owned.includes(id)){if(profile.coins<t.cost){if(typeof toast==='function')toast('تحتاج عملات أكثر لفتح هذا الثيم');return;}profile.coins-=t.cost;profile.owned.push(id);showReward('🛍️','ثيم جديد!',`تم فتح ثيم ${t.name}`);}profile.theme=id;saveProfile();document.body.dataset.raedTheme=id;injectHomeProgress(true);showStore();}

  function showCup(){
    const cells=[0,1,2].map(i=>`<div class="cup-step ${i<profile.cupProgress?'done':''}">${i<profile.cupProgress?'✓':'⚔️'}<span>مباراة ${i+1}</span></div>`).join('');
    openModal('كأس الساحة',`<div class="cup-hero"><span>🏆</span><h3>طريق كأس الساحة</h3><p>أكمل 3 مباريات لتحصل على كأس ومكافأة <b>250 عملة</b>.</p></div><div class="cup-road">${cells}</div><div class="cup-total">عدد الكؤوس المحققة: <b>${profile.cups}</b></div>`);
  }

  function injectHomeProgress(force=false){
    const hero=document.getElementById('homeScreen');if(!hero)return;
    let wrap=document.getElementById('v12Progress');if(wrap&&force){wrap.remove();wrap=null;}if(wrap)return;
    wrap=document.createElement('section');wrap.id='v12Progress';wrap.className='v12-progress';
    wrap.innerHTML=`<div class="v12-level-card"><div class="v12-level-ring"><img src="${LOGO}" alt=""><b>${level()}</b></div><div><span>${esc(profile.title)}</span><h3>مستوى الرائد ${level()}</h3><div class="v12-xp"><i style="width:${levelProgress()}%"></i></div><small>${profile.xp%500}/500 XP</small></div><button id="v12ProfileHome">عرض الملف</button></div><div class="v12-wallet"><span>🪙</span><div><small>رصيد المتجر</small><b>${profile.coins} عملة</b></div><button id="v12StoreHome">المتجر</button></div><div class="v12-cup-mini"><span>🏆</span><div><small>كأس الساحة</small><b>${profile.cupProgress}/3 مباريات</b></div><div class="cup-mini-bar"><i style="width:${profile.cupProgress/3*100}%"></i></div></div>`;
    const anchor=document.getElementById('v11HomeTools');if(anchor)anchor.insertAdjacentElement('afterend',wrap);else hero.appendChild(wrap);
    wrap.querySelector('#v12ProfileHome').onclick=showProfile;wrap.querySelector('#v12StoreHome').onclick=showStore;
  }

  function injectGameDock(){
    if(typeof state==='undefined'||state?.stage!=='game')return;ensureRiskMatch();
    const game=document.getElementById('gameScreen');if(!game)return;
    let dock=document.getElementById('v12GameDock');if(!dock){dock=document.createElement('div');dock.id='v12GameDock';dock.className='v12-game-dock';const power=document.getElementById('powerCenter');if(power)power.insertAdjacentElement('afterend',dock);else game.querySelector('.progress-row')?.insertAdjacentElement('afterend',dock);}
    const t=state.turn,used=risk.used[t],armed=risk.armed===t;
    dock.innerHTML=`<button id="riskBtn" class="v12-risk ${armed?'armed':''}" ${used&&!armed?'disabled':''}><span>🔥</span><div><b>${armed?'المخاطرة مفعلة':used?'تم استخدام المخاطرة':'مخاطرة'}</b><small>${armed?'السؤال القادم: +القيمة عند الصح / -القيمة عند الخطأ':'مرة واحدة لكل فريق في المباراة'}</small></div></button><button id="profileQuick" class="v12-quick"><span>⭐</span><div><b>Lv.${level()} • ${profile.title}</b><small>${profile.coins} عملة • ${profile.xp} XP</small></div></button><button id="storeQuick" class="v12-quick"><span>🏪</span><div><b>متجر الساحة</b><small>${THEMES.find(x=>x.id===profile.theme)?.name||'الساحة الأصلية'}</small></div></button>`;
    dock.querySelector('#riskBtn').onclick=armRisk;dock.querySelector('#profileQuick').onclick=showProfile;dock.querySelector('#storeQuick').onclick=showStore;
  }

  function armRisk(){
    if(state.stage!=='game')return;ensureRiskMatch();const t=state.turn;
    if(risk.used[t]&&risk.armed!==t){if(typeof toast==='function')toast('استخدم هذا الفريق المخاطرة بالفعل');return;}
    if(risk.armed===t){risk.armed=null;saveRisk();if(typeof toast==='function')toast('تم إلغاء المخاطرة قبل اختيار السؤال');injectGameDock();return;}
    risk.used[t]=true;risk.armed=t;saveRisk();if(typeof toast==='function')toast(`🔥 ${state.teams[t].name}: المخاطرة مفعلة للسؤال القادم`);injectGameDock();
  }

  function riskChip(){if(risk.armed===activeQuestionTeam){const a=document.getElementById('activeAids');if(a&&!a.querySelector('.risk-active-chip')){const c=document.createElement('span');c.className='active-aid risk-active-chip';c.textContent='🔥 مخاطرة: ربح أو خسارة قيمة السؤال';a.appendChild(c);}}}

  function processMatchRewards(){
    if(typeof state==='undefined'||state?.stage!=='winner')return;const id=state.startedAt||`legacy-${state.teams?.[0]?.score}-${state.teams?.[1]?.score}`;if(profile.processed.includes(id))return;
    let pwr={teams:[]};try{pwr=JSON.parse(localStorage.getItem('khallak_raed_power_v10')||'{"teams":[]}');}catch{}
    const correct=(pwr.teams||[]).reduce((s,x)=>s+(Number(x?.correct)||0),0);const best=Math.max(...state.teams.map(x=>Number(x.score)||0));
    const xp=120+correct*18+Math.min(300,Math.floor(best/200)*12);const coins=55+correct*6;
    const oldLevel=level();profile.xp+=xp;profile.coins+=coins;profile.matches++;profile.cupProgress++;profile.processed.push(id);profile.processed=profile.processed.slice(-80);
    let cupBonus=0;if(profile.cupProgress>=3){profile.cupProgress=0;profile.cups++;profile.coins+=250;cupBonus=250;}
    applyTitle();saveProfile();const newLevel=level();
    setTimeout(()=>{showReward(newLevel>oldLevel?'⭐':'🎁',newLevel>oldLevel?`وصلت للمستوى ${newLevel}`:'مكافأة المباراة',`+${xp} XP • +${coins} عملة${cupBonus?` • كأس الساحة +${cupBonus} 🪙`:''}`);injectWinnerXp(true);injectHomeProgress(true);injectProfileButton();},500);
  }

  function injectWinnerXp(force=false){
    const winner=document.getElementById('winnerScreen');if(!winner)return;let box=document.getElementById('v12WinnerProgress');if(box&&force){box.remove();box=null;}if(box)return;
    box=document.createElement('div');box.id='v12WinnerProgress';box.className='v12-winner-progress';box.innerHTML=`<div><span>⭐</span><b>المستوى ${level()}</b><small>${profile.xp} XP</small></div><div><span>🪙</span><b>${profile.coins} عملة</b><small>رصيد المتجر</small></div><div><span>🏆</span><b>${profile.cupProgress}/3</b><small>كأس الساحة</small></div><button id="v12WinnerProfile">ملف الرائد</button>`;
    const actions=winner.querySelector('.winner-actions');actions?.insertAdjacentElement('beforebegin',box);box.querySelector('#v12WinnerProfile').onclick=showProfile;
  }

  function showReward(icon,title,text){let o=document.getElementById('v12Reward');if(!o){o=document.createElement('div');o.id='v12Reward';o.className='v12-reward';document.body.appendChild(o);}o.innerHTML=`<span>${icon}</span><div><small>تقدم جديد</small><b>${esc(title)}</b><p>${esc(text)}</p></div>`;o.classList.add('show');setTimeout(()=>o.classList.remove('show'),3600);}

  function wrap(){
    if(typeof window.renderGame==='function'&&!window.renderGame.__v12){const old=window.renderGame;const fn=function(){const r=old.apply(this,arguments);setTimeout(()=>{applyVersion();injectGameDock();},0);return r;};fn.__v12=true;window.renderGame=fn;}
    if(typeof window.openQuestion==='function'&&!window.openQuestion.__v12){const old=window.openQuestion;const fn=function(){ensureRiskMatch();const r=old.apply(this,arguments);setTimeout(riskChip,0);return r;};fn.__v12=true;window.openQuestion=fn;}
    if(typeof window.judgePrimary==='function'&&!window.judgePrimary.__v12){const old=window.judgePrimary;const fn=function(correct){ensureRiskMatch();const team=activeQuestionTeam;const qv=Number(currentQuestion?.v)||0;const active=risk.armed===team;if(active&&qv){state.teams[team].score+=correct?qv:-qv;risk.armed=null;saveRisk();if(typeof saveGame==='function')saveGame();if(typeof toast==='function')toast(correct?`🔥 مخاطرة ناجحة: +${qv} نقطة إضافية`:`🔥 المخاطرة خسرت: -${qv} نقطة`);}const r=old.apply(this,arguments);setTimeout(()=>{if(state?.stage==='game')injectGameDock();},0);return r;};fn.__v12=true;window.judgePrimary=fn;}
    if(typeof window.finishGame==='function'&&!window.finishGame.__v12){const old=window.finishGame;const fn=function(){const r=old.apply(this,arguments);setTimeout(()=>{processMatchRewards();applyVersion();},180);return r;};fn.__v12=true;window.finishGame=fn;}
  }

  function init(){profile=loadProfile();applyVersion();wrap();setTimeout(()=>{applyVersion();wrap();},500);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('load',()=>{applyVersion();wrap();});
})();