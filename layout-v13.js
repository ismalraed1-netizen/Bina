(function(){
  const VERSION='ARENA V15';

  function apply(){
    document.body.classList.add('arena-layout-v13');
    document.body.dataset.layoutVersion='15';
    if(document.title!==`خلّك رائد | ${VERSION}`)document.title=`خلّك رائد | ${VERSION}`;
    const badge=document.querySelector('.build-badge');
    if(badge&&badge.textContent!==VERSION)badge.textContent=VERSION;
  }

  function init(){
    apply();
    setTimeout(apply,650);
    setTimeout(apply,1400);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
  window.addEventListener('load',apply,{once:true});
})();