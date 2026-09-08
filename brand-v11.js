(function(){
  const VERSION='ARENA V11';
  const LOGO='logo-raed.svg';
  const ACH_KEY='khallak_raed_achievements_v11';
  const DAILY_KEY='khallak_raed_daily_v11';
  const LEADER_KEY='khallak_raed_leaderboard_v10';
  const POWER_KEY='khallak_raed_power_v10';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function json(key,fallback){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;}}
  function todayKey(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
  function daily(){
    const bank=(typeof QUESTION_BANK!=='undefined'&&QUESTION_BANK.length)?QUESTION_BANK:[];
    const seed=hash(todayKey());
    const cat=bank.length?bank[seed%bank.length]:{id:'mix',name:'منوعات',icon:'🎯'};
    const target=1600+(seed%4)*200;
    return {key:todayKey(),cat,target};
  }

  function logoImg(cls=''){return `<img class="${cls}" src="${LOGO}" alt="شعار خلّك رائد">`;}

  function applyIdentity(){
    document.title=`خلّك رائد | ${VERSION}`;
    let fav=document.querySelector('link[rel="icon"]');
    if(!fav){fav=document.createElement('link');fav.rel='icon';document.head.appendChild(fav);}fav.href=`${LOGO}?v=11`;
    const badge=document.querySelector('.build-badge');if(badge)badge.textContent=VERSION;

    const mark=document.querySelector('.brand-mark');
    if(mark&&!mark.querySelector('img')){mark.classList.add('official-logo-wrap');mark.innerHTML=logoImg('official-logo');}
    document.querySelectorAll('.mini-brand').forEach(el=>{if(!el.querySelector('img')){el.classList.add('mini-logo-wrap');el.innerHTML=logoImg('mini-logo');}});

    const hero=document.querySelector('.hero-visual');
    if(hero&&!hero.dataset.v11){hero.dataset.v11='1';hero.classList.add('brand-visual');hero.innerHTML=`<div class="brand-orbit orbit-a"></div><div class="brand-orbit orbit-b"></div><div class="hero-logo-shell">${logoImg('hero-logo')}<div class="hero-logo-copy"><b>خلّك رائد</b><span>المعرفة تصنع القادة</span></div></div><div class="brand-spark s1"></div><div class="brand-spark s2"></div><div class="brand-spark s3"></div>`;}

    const trophy=document.querySelector('.trophy-column');
    if(trophy&&!trophy.querySelector('.v11-winner-logo'))trophy.insertAdjacentHTML('afterbegin',logoImg('v11-winner-logo'));
    injectTopButtons();
    injectHomeTools();
    injectShare();
    decorateDailyPick();
  }

  function injectTopButtons(){
    const top=document.querySelector('.top-actions');if(!top)return;
    if(!document.getElementById('achievementsBtn')){
      const b=document.createElement('button');b.id='achievementsBtn';b.className='icon-btn v11-top-btn';b.title='الإنجازات';b.innerHTML='<span>🏅</span><small>الإنجازات</small>';b.onclick=showAchievements;top.prepend(b);
    }
    if(!document.getElementById('hypeBtn')){
      const b=document.createElement('button');b.id='hypeBtn';b.className='icon-btn v11-top-btn';b.title='نمط الحماس';b.innerHTML='<span>🔥</span><small>الحماس</small>';b.onclick=()=>{document.body.classList.toggle('hype-mode');b.classList.toggle('active',document.body.classList.contains('hype-mode'));if(typeof toast==='function')toast(document.body.classList.contains('hype-mode')?'🔥 تم تشغيل نمط الحماس':'تم إيقاف نمط الحماس');};top.prepend(b);
    }
  }

  function injectHomeTools(){
    const hero=document.getElementById('homeScreen');if(!hero||document.getElementById('v11HomeTools'))return;
    const d=daily();
    const stats=brandStats();
    const wrap=document.createElement('div');wrap.id='v11HomeTools';wrap.className='v11-home-tools';
    wrap.innerHTML=`
      <section class="daily-card">
        <div class="daily-badge">✨ يتجدد كل يوم</div>
        <div class="daily-icon">${d.cat.icon||'🎯'}</div>
        <div class="daily-copy"><span>تحدي اليوم</span><h3>${esc(d.cat.name)}</h3><p>اختر فئة <b>${esc(d.cat.name)}</b> وحاول أن ينهي الفريق الفائز المباراة بـ <strong>${d.target}</strong> نقطة أو أكثر.</p></div>
        <button id="dailyStartBtn" class="daily-start">ابدأ تحدي اليوم <span>←</span></button>
      </section>
      <section class="brand-stats-card">
        <div class="brand-stats-title"><span>🏆</span><div><b>مسيرتك في خلّك رائد</b><small>تقدم محفوظ على هذا الجهاز</small></div></div>
        <div class="brand-stat-grid"><div><strong>${stats.matches}</strong><span>انتصار محفوظ</span></div><div><strong>${stats.best}</strong><span>أعلى نتيجة</span></div><div><strong>${stats.unlocked}/6</strong><span>إنجازات</span></div></div>
        <button id="homeAchievementsBtn" class="home-ach-btn">عرض الإنجازات</button>
      </section>`;
    hero.appendChild(wrap);
    wrap.querySelector('#dailyStartBtn').onclick=startDaily;
    wrap.querySelector('#homeAchievementsBtn').onclick=showAchievements;
  }

  function startDaily(){
    const d=daily();
    const timer=document.getElementById('timerSelect');if(timer)timer.value='20';
    const start=document.getElementById('startBtn');if(start)start.click();
    setTimeout(()=>{if(typeof renderCategoryPicker==='function')renderCategoryPicker(document.getElementById('categorySearch')?.value||'');decorateDailyPick();const card=[...document.querySelectorAll('.pick-card')].find(x=>x.querySelector('.pick-name')?.textContent.trim()===d.cat.name);card?.scrollIntoView({behavior:'smooth',block:'center'});if(typeof toast==='function')toast(`✨ تحدي اليوم: اختر فئة ${d.cat.name}`);},180);
  }

  function decorateDailyPick(){
    const d=daily();
    document.querySelectorAll('.pick-card').forEach(card=>{const name=card.querySelector('.pick-name')?.textContent.trim();card.classList.toggle('daily-pick',name===d.cat.name);if(name===d.cat.name&&!card.querySelector('.daily-pick-badge'))card.insertAdjacentHTML('afterbegin','<span class="daily-pick-badge">تحدي اليوم ✨</span>');});
  }

  function leaderboard(){return json(LEADER_KEY,[]);}
  function power(){return json(POWER_KEY,{teams:[]});}
  function dailyDone(){const x=json(DAILY_KEY,{});return !!x[todayKey()];}
  function achievementDefs(){
    const board=leaderboard(),p=power(),max=Math.max(0,...board.map(x=>Number(x.score)||0));
    const teams=Array.isArray(p.teams)?p.teams:[];
    return [
      {id:'first',icon:'🏆',name:'أول انتصار',desc:'سجل أول فوز في قائمة المتصدرين.',ok:board.length>=1},
      {id:'elite',icon:'👑',name:'فوق الثلاثة آلاف',desc:'حقق 3000 نقطة أو أكثر في مباراة.',ok:max>=3000},
      {id:'streak',icon:'🔥',name:'سلسلة نارية',desc:'حقق 3 إجابات صحيحة متتالية.',ok:teams.some(x=>(x.best||0)>=3)},
      {id:'sniper',icon:'🎯',name:'دقة عالية',desc:'حقق 5 إجابات صحيحة على الأقل في مباراة.',ok:teams.some(x=>(x.correct||0)>=5)},
      {id:'veteran',icon:'🛡️',name:'مخضرم الساحة',desc:'سجل 5 انتصارات محفوظة.',ok:board.length>=5},
      {id:'daily',icon:'✨',name:'رائد اليوم',desc:'أكمل تحدي اليوم بنجاح.',ok:dailyDone()}
    ];
  }
  function brandStats(){const board=leaderboard(),defs=achievementDefs();return {matches:board.length,best:Math.max(0,...board.map(x=>Number(x.score)||0)),unlocked:defs.filter(x=>x.ok).length};}

  function ensureBrandModal(){
    let m=document.getElementById('brandV11Modal');if(m)return m;
    m=document.createElement('div');m.id='brandV11Modal';m.className='modal hidden brand-v11-modal';m.innerHTML=`<div class="modal-card brand-v11-card"><div class="brand-v11-modal-head"><div class="brand-v11-modal-logo">${logoImg('modal-logo')}</div><div><span>خلّك رائد • V11</span><h3 id="brandV11Title">الإنجازات</h3></div><button id="brandV11Close">✕</button></div><div id="brandV11Body"></div></div>`;document.body.appendChild(m);m.querySelector('#brandV11Close').onclick=()=>m.classList.add('hidden');m.addEventListener('click',e=>{if(e.target===m)m.classList.add('hidden');});return m;
  }

  function showAchievements(){
    const m=ensureBrandModal(),defs=achievementDefs(),body=m.querySelector('#brandV11Body');m.querySelector('#brandV11Title').textContent='الإنجازات والشارات';
    body.innerHTML=`<div class="achievement-summary"><b>${defs.filter(x=>x.ok).length}</b><span>من 6 إنجازات مفتوحة</span><div><i style="width:${defs.filter(x=>x.ok).length/6*100}%"></i></div></div><div class="achievement-grid">${defs.map(x=>`<article class="achievement-item ${x.ok?'unlocked':'locked'}"><div class="achievement-icon">${x.ok?x.icon:'🔒'}</div><div><b>${esc(x.name)}</b><p>${esc(x.desc)}</p></div><span>${x.ok?'مفتوح':'مغلق'}</span></article>`).join('')}</div>`;
    m.classList.remove('hidden');
  }

  function injectShare(){
    const actions=document.querySelector('.winner-actions');if(!actions||document.getElementById('shareResultBtn'))return;
    const b=document.createElement('button');b.id='shareResultBtn';b.className='btn share-result-btn';b.innerHTML='↗ مشاركة النتيجة';b.onclick=shareResult;actions.appendChild(b);
  }
  async function shareResult(){
    if(typeof state==='undefined'||!state.teams)return;
    const a=state.teams[0],b=state.teams[1],winner=a.score===b.score?'تعادل':(a.score>b.score?a.name:b.name);
    const text=`🏆 خلّك رائد\n${a.name}: ${a.score} نقطة\n${b.name}: ${b.score} نقطة\nالرائد: ${winner}\n${location.href}`;
    try{if(navigator.share)await navigator.share({title:'خلّك رائد',text});else if(navigator.clipboard){await navigator.clipboard.writeText(text);if(typeof toast==='function')toast('تم نسخ النتيجة للمشاركة 📋');}else throw new Error('copy');}catch(e){if(e?.name!=='AbortError'&&typeof toast==='function')toast('تعذر فتح المشاركة على هذا الجهاز');}
  }

  function checkDailyCompletion(){
    if(typeof state==='undefined'||!state?.teams||!Array.isArray(state.selected))return;
    const d=daily();const selected=state.selected.some(x=>x.id===d.cat.id);const best=Math.max(...state.teams.map(x=>Number(x.score)||0));
    if(selected&&best>=d.target){const all=json(DAILY_KEY,{});if(!all[d.key]){all[d.key]={done:true,score:best,cat:d.cat.name};localStorage.setItem(DAILY_KEY,JSON.stringify(all));setTimeout(()=>showUnlock('✨','رائد اليوم','أكملت تحدي اليوم بنجاح!'),650);}}
  }

  function showUnlock(icon,title,text){
    let o=document.getElementById('achievementUnlock');if(!o){o=document.createElement('div');o.id='achievementUnlock';o.className='achievement-unlock';document.body.appendChild(o);}o.innerHTML=`<span>${icon}</span><div><small>إنجاز جديد</small><b>${esc(title)}</b><p>${esc(text)}</p></div>`;o.classList.add('show');setTimeout(()=>o.classList.remove('show'),3200);
  }

  function checkNewAchievements(){
    const prev=new Set(json(ACH_KEY,[])),defs=achievementDefs(),now=defs.filter(x=>x.ok).map(x=>x.id);localStorage.setItem(ACH_KEY,JSON.stringify(now));
    const fresh=defs.find(x=>x.ok&&!prev.has(x.id));if(prev.size&&fresh)showUnlock(fresh.icon,fresh.name,fresh.desc);
  }

  function wrapFunctions(){
    if(typeof window.renderCategoryPicker==='function'&&!window.renderCategoryPicker.__v11){const old=window.renderCategoryPicker;const fn=function(){const r=old.apply(this,arguments);setTimeout(decorateDailyPick,0);return r;};fn.__v11=true;window.renderCategoryPicker=fn;}
    if(typeof window.renderGame==='function'&&!window.renderGame.__v11){const old=window.renderGame;const fn=function(){const r=old.apply(this,arguments);setTimeout(()=>{applyIdentity();checkNewAchievements();},0);return r;};fn.__v11=true;window.renderGame=fn;}
    if(typeof window.finishGame==='function'&&!window.finishGame.__v11){const old=window.finishGame;const fn=function(){const r=old.apply(this,arguments);setTimeout(()=>{checkDailyCompletion();checkNewAchievements();applyIdentity();},120);return r;};fn.__v11=true;window.finishGame=fn;}
  }

  function init(){applyIdentity();wrapFunctions();checkNewAchievements();setTimeout(applyIdentity,350);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('load',()=>{applyIdentity();wrapFunctions();});
})();