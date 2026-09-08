(function(){
  document.documentElement.style.setProperty('--cyan','#e83b4e');
  function xml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));}
  function hash(s){let h=0;for(const c of String(s||''))h=(h*31+c.charCodeAt(0))>>>0;return h;}
  function art(icon,title,key='raed'){
    const sets=[
      ['#e83b4e','#731522','#21090e'],['#d44738','#7a2018','#210b08'],['#d89237','#7b451d','#211306'],['#b83246','#5c1824','#1d090d'],['#c84d61','#6d2230','#200b10']
    ];
    const p=sets[hash(key)%sets.length];
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="640" viewBox="0 0 1200 640">
      <defs>
        <radialGradient id="g" cx="72%" cy="26%" r="90%"><stop offset="0" stop-color="${p[0]}" stop-opacity=".48"/><stop offset=".48" stop-color="${p[1]}" stop-opacity=".22"/><stop offset="1" stop-color="#09090b"/></radialGradient>
        <linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff" stop-opacity=".11"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="s"><feDropShadow dx="0" dy="22" stdDeviation="18" flood-color="#000" flood-opacity=".5"/></filter>
      </defs>
      <rect width="1200" height="640" rx="34" fill="#09090b"/>
      <rect x="2" y="2" width="1196" height="636" rx="32" fill="url(#g)" stroke="#fff" stroke-opacity=".07" stroke-width="2"/>
      <circle cx="850" cy="280" r="205" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="2"/>
      <circle cx="850" cy="280" r="145" fill="none" stroke="${p[0]}" stroke-opacity=".20" stroke-width="2" stroke-dasharray="10 16"/>
      <path d="M0 500 C220 400 410 610 640 480 S990 390 1200 455 V640 H0Z" fill="url(#l)" opacity=".55"/>
      <text x="850" y="365" text-anchor="middle" font-size="235" filter="url(#s)">${xml(icon||'🎯')}</text>
      <text x="76" y="474" fill="#fff" font-size="64" font-family="Tahoma,Arial" font-weight="700">${xml(title||'خلّك رائد')}</text>
      <rect x="78" y="510" width="180" height="8" rx="4" fill="${p[0]}"/>
    </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  }

  window.categoryArtworkData=art;

  if(typeof renderCategoryPicker==='function'){
    renderCategoryPicker=function(filter=''){
      const grid=$('categoryPicker');if(!grid)return;grid.innerHTML='';
      const normalized=filter.trim().toLowerCase();
      QUESTION_BANK.filter(c=>!normalized||c.name.toLowerCase().includes(normalized)||c.desc.toLowerCase().includes(normalized)).forEach(cat=>{
        const selected=state.selected.find(x=>x.id===cat.id);
        const card=document.createElement('button');
        card.className='pick-card'+(selected?' selected':'');
        const owner=selected?`<div class="pick-owner">اختيار ${escapeHtml(state.teams[selected.owner].name)}</div>`:'';
        card.innerHTML=`<div class="check"></div><div class="pick-cover"><img src="${art(cat.icon,cat.name,cat.id)}" alt="${escapeHtml(cat.name)}"></div><div class="pick-card-body"><div class="pick-name">${escapeHtml(cat.name)}</div><div class="pick-desc">${escapeHtml(cat.desc)}</div>${owner}</div>`;
        card.disabled=!!selected||state.selected.length>=6;
        card.addEventListener('click',()=>pickCategory(cat.id));
        grid.appendChild(card);
      });
      updatePickerStatus();
    };
  }

  if(typeof renderGame==='function'){
    renderGame=function(){
      [0,1].forEach(i=>{
        $(`team${i+1}Name`).textContent=state.teams[i].name;
        $(`score${i+1}`).textContent=state.teams[i].score;
        $(`team${i+1}Card`).classList.toggle('active',state.turn===i);
        renderAids(i);
      });
      $('turnName').textContent=state.teams[state.turn].name;
      $('remainingText').textContent=`${36-state.played} سؤال متبقي`;
      $('progressBar').style.width=`${(state.played/36)*100}%`;
      const board=$('categoriesBoard');board.innerHTML='';
      state.selected.forEach(sel=>{
        const cat=QUESTION_BANK.find(c=>c.id===sel.id);if(!cat)return;
        const col=document.createElement('div');col.className='category';
        col.innerHTML=`<div class="cat-head"><img src="${art(cat.icon,cat.name,cat.id+'-board')}" alt="${escapeHtml(cat.name)}"><div class="cat-title"><b>${escapeHtml(cat.name)}</b><small>اختيار ${escapeHtml(state.teams[sel.owner].name)}</small></div></div>`;
        cat.questions.forEach((q,idx)=>{
          const qid=`${cat.id}-${idx}`,used=state.usedQuestions.includes(qid);
          const btn=document.createElement('button');btn.className='qbtn'+(used?' used':'');btn.disabled=used;btn.innerHTML=used?'—':`${q.v}`;
          btn.addEventListener('click',()=>openQuestion(cat.id,idx));col.appendChild(btn);
        });
        board.appendChild(col);
      });
    };
  }

  if(typeof renderQuestionMedia==='function'){
    const originalMedia=renderQuestionMedia;
    renderQuestionMedia=function(q){
      if(q&&q.mediaType&&q.mediaType!=='text'&&q.media){originalMedia(q);return;}
      const stage=document.getElementById('qMedia');if(!stage)return;
      stage.innerHTML='';stage.classList.add('show');
      const frame=document.createElement('div');frame.className='media-frame';
      const img=document.createElement('img');img.className='fallback-art';img.alt='صورة توضيحية للفئة';
      const cat=typeof QUESTION_BANK!=='undefined'?QUESTION_BANK.find(c=>c.id===q?.catId):null;
      img.src=art(cat?.icon||q?.catIcon||'🎯',cat?.name||q?.catName||'تحدي المعرفة',q?.catId||q?.catName||'question');
      frame.appendChild(img);stage.appendChild(frame);
    };
  }
})();