(function(){
  if(typeof QUESTION_BANK==='undefined'||!Array.isArray(QUESTION_BANK))return;
  if(QUESTION_BANK.some(c=>c.id==='image-challenge'))return;

  function visualCard(symbol,accent='#e11d48',accent2='#7f1d1d'){
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
      <defs>
        <radialGradient id="g" cx="50%" cy="42%" r="70%">
          <stop offset="0" stop-color="${accent}" stop-opacity=".34"/>
          <stop offset="1" stop-color="#09090b" stop-opacity="1"/>
        </radialGradient>
        <filter id="s"><feDropShadow dx="0" dy="22" stdDeviation="18" flood-color="#000" flood-opacity=".55"/></filter>
      </defs>
      <rect width="1200" height="720" rx="42" fill="#09090b"/>
      <rect x="22" y="22" width="1156" height="676" rx="34" fill="url(#g)" stroke="${accent2}" stroke-width="2"/>
      <circle cx="600" cy="350" r="220" fill="#111114" stroke="#ffffff" stroke-opacity=".08" stroke-width="2"/>
      <text x="600" y="430" text-anchor="middle" font-size="250" filter="url(#s)">${symbol}</text>
    </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  }

  QUESTION_BANK.push({
    id:'image-challenge',
    name:'تحدي الصور',
    icon:'🖼️',
    desc:'شاهد الصورة وخمّن الشيء أو المكان أو الرمز',
    questions:[
      {v:200,q:'ما الفاكهة الظاهرة في الصورة؟',a:'الأناناس',mediaType:'image',media:visualCard('🍍','#dc2626','#7f1d1d')},
      {v:200,q:'ما الحيوان الظاهر في الصورة؟',a:'الباندا',mediaType:'image',media:visualCard('🐼','#b91c1c','#450a0a')},
      {v:400,q:'أي رياضة ترمز لها هذه الصورة؟',a:'كرة السلة',mediaType:'image',media:visualCard('🏀','#ef4444','#991b1b')},
      {v:400,q:'ما الأداة الظاهرة في الصورة؟',a:'البوصلة',mediaType:'image',media:visualCard('🧭','#be123c','#881337')},
      {v:600,q:'ما اسم هذه التماثيل الشهيرة؟',a:'تماثيل مواي في جزيرة القيامة',mediaType:'image',media:visualCard('🗿','#9f1239','#4c0519')},
      {v:600,q:'ما اسم البرج الذي يرمز له الشكل الظاهر؟',a:'برج طوكيو',mediaType:'image',media:visualCard('🗼','#f43f5e','#881337')}
    ]
  });

  window.addEventListener('DOMContentLoaded',()=>{
    const style=document.createElement('style');
    style.textContent='.question-card{margin:0 auto!important}.modal{align-items:flex-start!important}';
    document.head.appendChild(style);
    if(document.querySelector('script[data-ui-v8]'))return;
    const s=document.createElement('script');
    s.src='ui-v8.js?v=20260908-v8b';
    s.async=false;
    s.dataset.uiV8='true';
    document.body.appendChild(s);
  });
})();