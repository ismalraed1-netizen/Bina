(function(){
  const esc = s => (typeof escapeHtml==='function'?escapeHtml(String(s??'')):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])));

  function makeArt(icon,title,key='raed'){
    const palettes=[['#7b2cff','#27105d','#07162f'],['#00a9ff','#063c83','#07162f'],['#ffb62e','#6d3c08','#0b1730'],['#b84cff','#34206e','#061632'],['#17bdf9','#074a86','#07182f']];
    let h=0;for(const c of String(key))h=(h*31+c.charCodeAt(0))>>>0;const p=palettes[h%palettes.length];
    const safe = String(title||'خلّك رائد').replace(/[&<>]/g,'');
    const symbol = String(icon||'🎯').replace(/[&<>]/g,'');
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
      <defs><radialGradient id="g" cx="55%" cy="38%" r="72%"><stop stop-color="${p[0]}" stop-opacity=".55"/><stop offset=".42" stop-color="${p[1]}" stop-opacity=".38"/><stop offset="1" stop-color="${p[2]}"/></radialGradient><filter id="s"><feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#000" flood-opacity=".55"/></filter></defs>
      <rect width="1200" height="700" fill="#031027"/><rect x="2" y="2" width="1196" height="696" rx="36" fill="url(#g)" stroke="#6fa9ff" stroke-opacity=".22" stroke-width="3"/>
      <circle cx="850" cy="300" r="220" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/><circle cx="850" cy="300" r="155" fill="none" stroke="${p[0]}" stroke-opacity=".25" stroke-width="3" stroke-dasharray="9 17"/>
      <path d="M0 520 C240 430 370 610 610 500 S960 410 1200 480 V700 H0Z" fill="#fff" fill-opacity=".035"/>
      <text x="850" y="390" text-anchor="middle" font-size="245" filter="url(#s)">${symbol}</text>
      <text x="76" y="520" fill="#fff" font-size="66" font-family="Tahoma,Arial" font-weight="700">${safe}</text>
      <rect x="78" y="554" width="210" height="8" rx="4" fill="${p[0]}"/>
    </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  }

  function injectArena(){
    if(document.querySelector('.arena-world'))return;
    const world=document.createElement('div');world.className='arena-world';world.setAttribute('aria-hidden','true');
    world.innerHTML=`<div class="stage-beam left"></div><div class="stage-beam right"></div><div class="stage-lights"></div>
      <aside class="team-banner left"><span class="banner-icon">🦅</span><b id="arenaTeamLeftName">الصقور</b><small>معاً نحو القمة</small></aside>
      <aside class="team-banner right"><span class="banner-icon">🐎</span><b id="arenaTeamRightName">الفرسان</b><small>قوة المعرفة</small></aside>
      <div class="side-slogan left">المعرفة<br>تصنع<br>القادة</div><div class="side-slogan right">فكر<br>أسرع<br>كن رائداً</div>`;
    document.body.prepend(world);
  }

  function injectNav(){
    const top=document.querySelector('.topbar');if(!top||top.querySelector('.arena-nav'))return;
    const nav=document.createElement('nav');nav.className='arena-nav';
    nav.innerHTML=`<button class="active" data-nav="home">الرئيسية</button><button data-nav="leaders">قائمة المتصدرين</button><button data-nav="how">كيف تلعب؟</button><button data-nav="about">عن اللعبة</button>`;
    top.appendChild(nav);
    nav.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b)return;
      nav.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');
      if(b.dataset.nav==='home'){if(typeof showStage==='function')showStage('home');window.scrollTo({top:0,behavior:'smooth'});}
      else if(b.dataset.nav==='how')openInfo('كيف تلعب؟','فريقان، يختار كل فريق 3 فئات. اختر سؤالاً، أجب قبل انتهاء الوقت، واستخدم وسائل المساعدة في الوقت المناسب. الفريق صاحب أعلى نقاط يفوز.');
      else if(b.dataset.nav==='leaders')openInfo('قائمة المتصدرين','لوحة المتصدرين المحلية ستكون مرتبطة بنتائج المباريات المحفوظة في المرحلة القادمة.');
      else openInfo('عن خلّك رائد','لعبة مسابقات عربية جماعية تجمع المعرفة والسرعة والمنافسة بين فريقين.');
    });
  }

  function openInfo(title,text){
    let m=document.getElementById('arenaInfoModal');
    if(!m){m=document.createElement('div');m.id='arenaInfoModal';m.className='modal hidden';m.innerHTML=`<div class="modal-card settings-card"><div class="question-top"><div><span class="section-kicker">خلّك رائد</span><h3 id="arenaInfoTitle"></h3></div><button class="icon-btn close-btn" id="arenaInfoClose">✕</button></div><p id="arenaInfoText" style="color:#c8d6ec;line-height:1.9;font-size:13px"></p></div>`;document.body.appendChild(m);m.querySelector('#arenaInfoClose').onclick=()=>m.classList.add('hidden');}
    m.querySelector('#arenaInfoTitle').textContent=title;m.querySelector('#arenaInfoText').textContent=text;m.classList.remove('hidden');
  }

  function decorateStatic(){
    document.title='خلّك رائد | Arena V9';
    const badge=document.querySelector('.build-badge');if(badge)badge.textContent='ARENA V9';
    const h=document.querySelector('#homeScreen h2');if(h)h.innerHTML='مين فيكم <span class="gradient-text">الرائد؟</span>';
    const copy=document.querySelector('#homeScreen .hero-copy');if(copy)copy.textContent='تحدي معرفي جماعي يجمع بين الثقافة والسرعة والتفكير الذكي. اختبروا معلوماتكم، نافسوا أصحابكم، وكونوا أنتم الروّاد!';
    const feats=document.querySelector('#homeScreen .feature-row');if(feats)feats.innerHTML='<span class="feature"><i>▦</i> 6 فئات</span><span class="feature"><i>▤</i> 36 سؤال</span><span class="feature"><i>✦</i> وسائل مساعدة</span><span class="feature"><i>☁</i> حفظ واستكمال</span>';
    document.querySelectorAll('.mini-mascot').forEach((el,i)=>el.textContent=i===0?'🦅':'🐎');
    document.querySelectorAll('.aid-mascot').forEach((el,i)=>el.textContent=i===0?'🦅':'🐎');
    const e1=document.querySelector('#team1Card .team-emblem');if(e1)e1.textContent='🦅';
    const e2=document.querySelector('#team2Card .team-emblem');if(e2)e2.textContent='🐎';
    const f1=document.querySelector('.final-one .final-emblem');if(f1)f1.textContent='🦅';
    const f2=document.querySelector('.final-two .final-emblem');if(f2)f2.textContent='🐎';
    const crown=document.querySelector('.winner-crown');if(crown)crown.textContent='♛';
    const wi=document.getElementById('winnerIcon');if(wi)wi.textContent='🏆';
    const admin=document.getElementById('adminBtn');if(admin){admin.classList.add('admin-top-btn');admin.innerHTML='<span>👤</span><small>استوديو المشرف</small>';admin.title='استوديو المشرف';}
    const t1=document.getElementById('team1Input'),t2=document.getElementById('team2Input');
    const sync=()=>{const a=document.getElementById('arenaTeamLeftName'),b=document.getElementById('arenaTeamRightName');if(a)a.textContent=t1?.value||'الصقور';if(b)b.textContent=t2?.value||'الفرسان';};
    t1?.addEventListener('input',sync);t2?.addEventListener('input',sync);sync();
    const qText=document.getElementById('qText');if(qText&&qText.parentElement&&!qText.parentElement.classList.contains('question-content')){const wrap=document.createElement('div');wrap.className='question-content';qText.parentNode.insertBefore(wrap,qText);wrap.appendChild(qText);const media=document.getElementById('qMedia');if(media)wrap.insertBefore(media,qText);}
  }

  if(typeof renderCategoryPicker==='function'){
    window.renderCategoryPicker=function(filter=''){
      const grid=$('categoryPicker');if(!grid)return;grid.innerHTML='';
      const normalized=String(filter||'').trim().toLowerCase();
      QUESTION_BANK.filter(c=>!normalized||String(c.name).toLowerCase().includes(normalized)||String(c.desc||'').toLowerCase().includes(normalized)).forEach(cat=>{
        const selected=state.selected.find(x=>x.id===cat.id);const owner=selected?.owner;
        const card=document.createElement('button');card.className='pick-card'+(selected?` selected owner-${owner}`:'');
        card.innerHTML=`<div class="check"></div><div class="pick-icon">${cat.icon||'🎯'}</div><div class="pick-name">${esc(cat.name)}</div><div class="pick-desc">${esc(cat.desc||'')}</div>${selected?`<div class="pick-owner">✓ اختيار ${esc(state.teams[owner].name)}</div>`:''}`;
        card.disabled=!!selected||state.selected.length>=6;card.addEventListener('click',()=>pickCategory(cat.id));grid.appendChild(card);
      });
      updatePickerStatus();
    };
  }

  if(typeof renderGame==='function'){
    window.renderGame=function(){
      [0,1].forEach(i=>{
        $(`team${i+1}Name`).textContent=state.teams[i].name;$(`score${i+1}`).textContent=state.teams[i].score;$(`team${i+1}Card`).classList.toggle('active',state.turn===i);renderAids(i);
      });
      const left=document.getElementById('arenaTeamLeftName'),right=document.getElementById('arenaTeamRightName');if(left)left.textContent=state.teams[0].name;if(right)right.textContent=state.teams[1].name;
      $('turnName').textContent=state.teams[state.turn].name;$('remainingText').textContent=`${36-state.played} سؤال متبقي`;$('progressBar').style.width=`${(state.played/36)*100}%`;
      const board=$('categoriesBoard');board.innerHTML='';
      state.selected.forEach(sel=>{
        const cat=QUESTION_BANK.find(c=>c.id===sel.id);if(!cat)return;const col=document.createElement('div');col.className=`category owner-${sel.owner}`;
        col.innerHTML=`<div class="cat-head"><span class="cat-icon">${cat.icon||'🎯'}</span><b>${esc(cat.name)}</b><small>${esc(cat.desc||'')}</small></div>`;
        cat.questions.forEach((q,idx)=>{const qid=`${cat.id}-${idx}`,used=state.usedQuestions.includes(qid);const btn=document.createElement('button');btn.className='qbtn'+(used?' used':'');btn.disabled=used;btn.textContent=used?'✓':String(q.v);btn.addEventListener('click',()=>openQuestion(cat.id,idx));col.appendChild(btn);});
        board.appendChild(col);
      });
      const e1=document.querySelector('#team1Card .team-emblem');if(e1)e1.textContent='🦅';const e2=document.querySelector('#team2Card .team-emblem');if(e2)e2.textContent='🐎';
    };
  }

  if(typeof renderQuestionMedia==='function'){
    const originalMedia=renderQuestionMedia;
    window.renderQuestionMedia=function(q){
      if(q&&q.mediaType&&q.mediaType!=='text'&&q.media){originalMedia(q);return;}
      const stage=document.getElementById('qMedia');if(!stage)return;stage.innerHTML='';stage.classList.add('show');
      const cat=QUESTION_BANK.find(c=>c.id===q?.catId);const frame=document.createElement('div');frame.className='media-frame';const img=document.createElement('img');img.alt=`صورة توضيحية ${cat?.name||''}`;img.src=makeArt(cat?.icon||q?.catIcon||'🎯',cat?.name||q?.catName||'تحدي المعرفة',q?.catId||q?.catName||'question');frame.appendChild(img);stage.appendChild(frame);
    };
  }

  injectArena();injectNav();decorateStatic();
  window.addEventListener('load',decorateStatic);
})();