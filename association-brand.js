(()=>{
  const NAME='ميدان بناء';
  function applyBrand(){
    if(document.title!=='ميدان بناء | تحدي الموظفين')document.title='ميدان بناء | تحدي الموظفين';
    const badge=document.querySelector('.build-badge');
    if(badge&&badge.textContent!=='تحدي الموظفين')badge.textContent='تحدي الموظفين';
    document.querySelectorAll('.hero-logo-copy b').forEach(el=>{if(el.textContent!==NAME)el.textContent=NAME;});
    document.querySelectorAll('.hero-logo-copy span').forEach(el=>{if(el.textContent!=='نتنافس بروح الفريق الواحد')el.textContent='نتنافس بروح الفريق الواحد';});
    document.querySelectorAll('img[alt="شعار خلّك رائد"]').forEach(el=>el.alt='شعار ميدان بناء');
    const h=document.querySelector('#homeScreen h2');
    if(h&&!h.textContent.includes('جاهزين'))h.innerHTML='جاهزين لـ <span class="gradient-text">التحدي؟</span>';
    const studio=document.querySelector('.admin-head h2');
    if(studio&&studio.textContent!=='🛠️ استوديو ميدان بناء')studio.textContent='🛠️ استوديو ميدان بناء';
  }
  window.addEventListener('DOMContentLoaded',()=>{
    applyBrand();
    const chip=document.createElement('div');
    chip.className='association-chip';
    chip.textContent='جمعية بناء وتنمية مساكن بمنطقة جازان';
    document.body.appendChild(chip);
    new MutationObserver(applyBrand).observe(document.body,{childList:true,subtree:true});
  });
})();
