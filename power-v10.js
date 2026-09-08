(function(){
  const POWER_KEY='khallak_raed_power_v10';
  const LEADER_KEY='khallak_raed_leaderboard_v10';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  const fresh=()=>({matchId:null,teams:[{correct:0,wrong:0,streak:0,best:0,steals:0},{correct:0,wrong:0,streak:0,best:0,steals:0}],history:[],surpriseUsed:false,surprise:null,savedResult:false});
  let power=fresh();

  function loadPower(){
    try{const raw=localStorage.getItem(POWER_KEY);if(raw)power={...fresh(),...JSON.parse(raw)};}catch{power=fresh();}
    if(!Array.isArray(power.teams)||power.teams.length!==2)power=fresh();
  }
  function savePower(){try{localStorage.setItem(POWER_KEY,JSON.stringify(power));}catch{}}
  function ensureMatch(){
    const id=state?.startedAt||null;
    if(id&&power.matchId!==id){power=fresh();power.matchId=id;savePower();}
  }
  function addHistory(team,type,text,points=0,icon='•'){
    power.history.unshift({time:Date.now(),team,type,text,points,icon});
    power.history=power.history.slice(0,60);savePower();
  }
  function stat(i){return power.teams[i]||(power.teams[i]={correct:0,wrong:0,streak:0,best:0,steals:0});}
  function accuracy(i){const s=stat(i),n=s.correct+s.wrong;return n?Math.round(s.correct/n*100):0;}

  function injectTools(){
    const game=document.getElementById('gameScreen');if(!game)return;
    if(!document.getElementById('powerCenter')){
      const row=document.createElement('div');row.id='powerCenter';row.className='power-center';
      row.innerHTML=`<div class="power-live"><span id="powerStreak1">🦅 جاهز</span><b id="powerMomentum">⚔️ المنافسة تبدأ الآن</b><span id="powerStreak2">🐎 جاهز</span></div>
      <div class="power-actions">
        <button id="powerRandom" class="power-btn"><i>🎲</i><span>سؤال عشوائي<small>اختيار من الأسئلة المتبقية</small></span></button>
        <button id="powerSurprise" class="power-btn surprise"><i>⚡</i><span>صندوق المفاجأة<small>ميزة واحدة في المباراة</small></span></button>
        <button id="powerStats" class="power-btn"><i>📊</i><span>الإحصائيات<small>الدقة والسلاسل</small></span></button>
        <button id="powerHistory" class="power-btn"><i>🧾</i><span>سجل المباراة<small>آخر أحداث المواجهة</small></span></button>
      </div>`;
      const progress=game.querySelector('.progress-row');progress?.insertAdjacentElement('afterend',row);
      row.querySelector('#powerRandom').onclick=randomQuestion;
      row.querySelector('#powerSurprise').onclick=drawSurprise;
      row.querySelector('#powerStats').onclick=showStats;
      row.querySelector('#powerHistory').onclick=showHistory;
    }
    injectModalShells();
  }

  function injectModalShells(){
    if(!document.getElementById('powerModal')){
      const m=document.createElement('div');m.id='powerModal';m.className='modal hidden power-modal';
      m.innerHTML=`<div class="modal-card power-modal-card"><div class="power-modal-head"><div><span>خلّك رائد • V10</span><h3 id="powerModalTitle">الإحصائيات</h3></div><button id="powerModalClose" class="power-close">✕</button></div><div id="powerModalBody"></div></div>`;
      document.body.appendChild(m);m.querySelector('#powerModalClose').onclick=()=>m.classList.add('hidden');
      m.addEventListener('click',e=>{if(e.target===m)m.classList.add('hidden');});
    }
  }

  function renderPower(){
    if(state?.stage!=='game')return;
    ensureMatch();injectTools();
    const s0=stat(0),s1=stat(1);
    const e0=document.getElementById('powerStreak1'),e1=document.getElementById('powerStreak2');
    if(e0)e0.textContent=s0.streak>=2?`🔥 ${state.teams[0].name} ×${s0.streak}`:`🦅 ${accuracy(0)}% دقة`;
    if(e1)e1.textContent=s1.streak>=2?`🔥 ${state.teams[1].name} ×${s1.streak}`:`🐎 ${accuracy(1)}% دقة`;
    const m=document.getElementById('powerMomentum');if(m){
      const gap=Math.abs(state.teams[0].score-state.teams[1].score);
      const leader=state.teams[0].score===state.teams[1].score?null:(state.teams[0].score>state.teams[1].score?0:1);
      const hot=s0.streak>=3?0:s1.streak>=3?1:null;
      m.textContent=hot!==null?`🔥 ${state.teams[hot].name} في سلسلة ${stat(hot).streak} إجابات`:gap>=800&&leader!==null?`⚡ ${state.teams[1-leader].name} أمام فرصة عودة قوية`:`⚔️ المنافسة مشتعلة — ${36-state.played} سؤال متبقي`;
    }
    const surprise=document.getElementById('powerSurprise');
    if(surprise){surprise.disabled=power.surpriseUsed;surprise.classList.toggle('used',power.surpriseUsed);const sm=surprise.querySelector('small');if(sm)sm.textContent=power.surprise?surpriseLabel(power.surprise):power.surpriseUsed?'تم استخدام المفاجأة':'ميزة واحدة في المباراة';}
    renderTeamBadges();
  }

  function renderTeamBadges(){
    [0,1].forEach(i=>{
      const card=document.getElementById(`team${i+1}Card`);if(!card)return;
      let badge=card.querySelector('.streak-badge');if(!badge){badge=document.createElement('div');badge.className='streak-badge';card.appendChild(badge);}
      const s=stat(i);badge.textContent=s.streak>=2?`🔥 سلسلة ${s.streak}`:`🎯 ${accuracy(i)}%`;
      badge.classList.toggle('hot',s.streak>=3);
    });
  }

  function randomQuestion(){
    if(state.stage!=='game'){toast('ابدأ المباراة أولاً');return;}
    const pool=[];
    state.selected.forEach(sel=>{const cat=QUESTION_BANK.find(c=>c.id===sel.id);cat?.questions.forEach((q,index)=>{const qid=`${cat.id}-${index}`;if(!state.usedQuestions.includes(qid))pool.push({catId:cat.id,index,value:q.v,name:cat.name});});});
    if(!pool.length){toast('انتهت كل الأسئلة');return;}
    const pick=pool[Math.floor(Math.random()*pool.length)];
    toast(`🎲 الاختيار العشوائي: ${pick.name} • ${pick.value} نقطة`);setTimeout(()=>openQuestion(pick.catId,pick.index),350);
  }

  function surpriseLabel(s){return s.type==='bonus'?'🎁 +300 على الإجابة الصحيحة':s.type==='time'?'⏱ +15 ثانية للسؤال القادم':'✨ مفاجأة مفعلة';}
  function drawSurprise(){
    ensureMatch();if(power.surpriseUsed){toast('صندوق المفاجأة استُخدم في هذه المباراة');return;}
    const list=[{type:'bonus'},{type:'time'}];power.surprise=list[Math.floor(Math.random()*list.length)];power.surpriseUsed=true;savePower();renderPower();
    const text=surpriseLabel(power.surprise);addHistory(state.turn,'surprise',text,0,'⚡');toast(`⚡ صندوق المفاجأة: ${text}`);
    pulseCenter(text);
  }

  function pulseCenter(text){
    let o=document.getElementById('surpriseFlash');if(!o){o=document.createElement('div');o.id='surpriseFlash';o.className='surprise-flash';document.body.appendChild(o);}
    o.innerHTML=`<div><span>⚡</span><b>مفاجأة!</b><p>${esc(text)}</p></div>`;o.classList.add('show');setTimeout(()=>o.classList.remove('show'),1800);
  }

  function showStats(){
    ensureMatch();injectModalShells();const body=document.getElementById('powerModalBody');document.getElementById('powerModalTitle').textContent='إحصائيات المباراة';
    body.innerHTML=`<div class="stats-grid">${[0,1].map(i=>{const s=stat(i);return `<section class="stats-team team-${i}"><div class="stats-title"><span>${i===0?'🦅':'🐎'}</span><div><b>${esc(state.teams[i].name)}</b><small>${state.teams[i].score} نقطة</small></div></div><div class="stat-cells"><div><strong>${s.correct}</strong><span>صحيحة</span></div><div><strong>${s.wrong}</strong><span>خاطئة</span></div><div><strong>${accuracy(i)}%</strong><span>الدقة</span></div><div><strong>${s.best}</strong><span>أفضل سلسلة</span></div><div><strong>${s.steals}</strong><span>سرقات ناجحة</span></div><div><strong>${s.streak}</strong><span>السلسلة الحالية</span></div></div></section>`}).join('')}</div><div class="match-insight">${matchInsight()}</div>`;
    document.getElementById('powerModal').classList.remove('hidden');
  }

  function matchInsight(){
    const a=stat(0),b=stat(1);if(a.correct===b.correct)return '⚔️ الفريقان متقاربان في عدد الإجابات الصحيحة.';
    const i=a.correct>b.correct?0:1;return `🏅 ${esc(state.teams[i].name)} يتقدم معرفياً بـ ${Math.abs(a.correct-b.correct)} إجابة صحيحة.`;
  }

  function showHistory(){
    ensureMatch();injectModalShells();document.getElementById('powerModalTitle').textContent='سجل المباراة';const body=document.getElementById('powerModalBody');
    if(!power.history.length)body.innerHTML='<div class="empty-history">🧾 لا توجد أحداث بعد — ابدأوا أول سؤال!</div>';
    else body.innerHTML=`<div class="history-list">${power.history.map(h=>`<div class="history-item"><span class="history-icon">${h.icon||'•'}</span><div><b>${h.team===null?'المباراة':esc(state.teams[h.team]?.name||'الفريق')}</b><p>${esc(h.text)}</p></div><strong class="${h.points>0?'plus':h.points<0?'minus':''}">${h.points?`${h.points>0?'+':''}${h.points}`:''}</strong></div>`).join('')}</div>`;
    document.getElementById('powerModal').classList.remove('hidden');
  }

  function showCountdown(){
    let o=document.getElementById('matchCountdown');if(o)o.remove();o=document.createElement('div');o.id='matchCountdown';o.className='match-countdown';o.innerHTML='<div><small>استعدوا</small><b>3</b></div>';document.body.appendChild(o);
    const b=o.querySelector('b');let n=3;const timer=setInterval(()=>{n--;if(n>0){b.textContent=n;b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');}else if(n===0){b.textContent='ابدأ!';b.classList.add('go');beep('start');}else{clearInterval(timer);o.classList.add('out');setTimeout(()=>o.remove(),350);}},650);
  }

  function leaderboard(){try{return JSON.parse(localStorage.getItem(LEADER_KEY)||'[]');}catch{return[];}}
  function saveLeaderboard(){
    if(power.savedResult||state.teams[0].score===state.teams[1].score)return;
    const w=state.teams[0].score>state.teams[1].score?0:1,l=1-w;let list=leaderboard();
    if(list.some(x=>x.matchId===power.matchId)){power.savedResult=true;savePower();return;}
    list.push({matchId:power.matchId,name:state.teams[w].name,score:state.teams[w].score,opponent:state.teams[l].name,correct:stat(w).correct,date:Date.now()});
    list.sort((a,b)=>b.score-a.score);list=list.slice(0,12);localStorage.setItem(LEADER_KEY,JSON.stringify(list));power.savedResult=true;savePower();
  }
  function showLeaderboard(){
    injectModalShells();document.getElementById('powerModalTitle').textContent='قائمة المتصدرين';const list=leaderboard(),body=document.getElementById('powerModalBody');
    body.innerHTML=list.length?`<div class="leader-list">${list.map((x,i)=>`<div class="leader-row"><span class="rank">${i<3?['🥇','🥈','🥉'][i]:i+1}</span><div><b>${esc(x.name)}</b><small>ضد ${esc(x.opponent)} • ${x.correct||0} إجابة صحيحة</small></div><strong>${x.score}</strong></div>`).join('')}</div>`:'<div class="empty-history">🏆 لا توجد نتائج محفوظة حتى الآن.</div>';
    document.getElementById('powerModal').classList.remove('hidden');
  }

  function hookLeaderboardNav(){
    document.addEventListener('click',e=>{const b=e.target.closest('.arena-nav [data-nav="leaders"]');if(!b)return;e.preventDefault();e.stopPropagation();showLeaderboard();},true);
  }

  const originalStartMatch=window.startMatch;
  if(typeof originalStartMatch==='function')window.startMatch=function(){const before=state.stage;originalStartMatch.apply(this,arguments);if(state.stage==='game'&&before!=='game'){power=fresh();power.matchId=state.startedAt;savePower();renderPower();showCountdown();}};

  const originalRenderGame=window.renderGame;
  if(typeof originalRenderGame==='function')window.renderGame=function(){const r=originalRenderGame.apply(this,arguments);renderPower();return r;};

  const originalOpenQuestion=window.openQuestion;
  if(typeof originalOpenQuestion==='function')window.openQuestion=function(){ensureMatch();const timed=power.surprise?.type==='time';const r=originalOpenQuestion.apply(this,arguments);if(timed&&currentQuestion){timeLeft+=15;timerTotal+=15;updateTimerVisual();addHistory(activeQuestionTeam,'surprise','مفاجأة الوقت: +15 ثانية',0,'⏱');power.surprise=null;savePower();toast('⏱ مفاجأة الوقت: تمت إضافة 15 ثانية');renderPower();}return r;};

  const originalJudge=window.judgePrimary;
  if(typeof originalJudge==='function')window.judgePrimary=function(correct){
    ensureMatch();const team=activeQuestionTeam,snapshot=currentQuestion?{cat:currentQuestion.catName,q:currentQuestion.q,v:currentQuestion.v}:null,before=[state.teams[0].score,state.teams[1].score];
    let bonus=0;if(power.surprise?.type==='bonus'){if(correct){bonus=300;state.teams[team].score+=bonus;}power.surprise=null;savePower();}
    const r=originalJudge.apply(this,arguments);const s=stat(team);
    if(correct){s.correct++;s.streak++;s.best=Math.max(s.best,s.streak);const gain=Math.max(0,state.teams[team].score-before[team]);addHistory(team,'correct',`${snapshot?.cat||'سؤال'} • ${snapshot?.v||''} — إجابة صحيحة${bonus?' + مفاجأة':''}`,gain,'✅');}
    else{s.wrong++;s.streak=0;addHistory(team,'wrong',`${snapshot?.cat||'سؤال'} • ${snapshot?.v||''} — إجابة خاطئة`,0,'❌');}
    savePower();renderPower();return r;
  };

  const originalFinishSteal=window.finishSteal;
  if(typeof originalFinishSteal==='function')window.finishSteal=function(correct){
    ensureMatch();const thief=1-activeQuestionTeam,snapshot=currentQuestion?{cat:currentQuestion.catName,v:currentQuestion.v}:null,before=state.teams[thief].score;const r=originalFinishSteal.apply(this,arguments),s=stat(thief);
    if(correct){s.correct++;s.steals++;s.streak++;s.best=Math.max(s.best,s.streak);addHistory(thief,'steal',`${snapshot?.cat||'سؤال'} • سرقة ناجحة`,Math.max(0,state.teams[thief].score-before),'🔥');}
    else{s.wrong++;s.streak=0;addHistory(thief,'steal',`${snapshot?.cat||'سؤال'} • محاولة سرقة خاطئة`,0,'↔️');}
    savePower();renderPower();return r;
  };

  const originalFinishGame=window.finishGame;
  if(typeof originalFinishGame==='function')window.finishGame=function(){ensureMatch();const r=originalFinishGame.apply(this,arguments);if(state.teams[0].score!==state.teams[1].score){saveLeaderboard();setTimeout(injectWinnerInsight,40);}return r;};

  const originalReset=window.resetEverything;
  if(typeof originalReset==='function')window.resetEverything=function(){const r=originalReset.apply(this,arguments);if(state.stage==='home'){power=fresh();localStorage.removeItem(POWER_KEY);}return r;};

  function injectWinnerInsight(){
    const winner=document.getElementById('winnerScreen');if(!winner)return;let box=winner.querySelector('.winner-insight');if(!box){box=document.createElement('div');box.className='winner-insight';winner.querySelector('.winner-actions')?.before(box);}
    const best=stat(0).correct===stat(1).correct?(state.teams[0].score>=state.teams[1].score?0:1):(stat(0).correct>stat(1).correct?0:1);
    box.innerHTML=`<span>⭐ نجم المباراة</span><b>${esc(state.teams[best].name)}</b><small>${stat(best).correct} إجابة صحيحة • أفضل سلسلة ${stat(best).best} • دقة ${accuracy(best)}%</small>`;
  }

  loadPower();injectTools();injectModalShells();hookLeaderboardNav();
  const badge=document.querySelector('.build-badge');if(badge)badge.textContent='ARENA V10';document.title='خلّك رائد | Arena V10';
  window.addEventListener('load',()=>{ensureMatch();if(state?.stage==='game')renderPower();});
})();