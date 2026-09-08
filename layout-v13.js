(function(){
  const VERSION='ARENA V13';
  function apply(){
    document.body.classList.add('arena-layout-v13');
    document.body.dataset.layoutVersion='13';
    document.title=`خلّك رائد | ${VERSION}`;
    const badge=document.querySelector('.build-badge');
    if(badge&&badge.textContent!==VERSION)badge.textContent=VERSION;
  }
  function init(){
    apply();
    const badge=document.querySelector('.build-badge');
    if(badge){
      new MutationObserver(()=>{if(badge.textContent!==VERSION)badge.textContent=VERSION;}).observe(badge,{childList:true,subtree:true,characterData:true});
    }
    setTimeout(apply,250);
    setTimeout(apply,900);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('load',apply);
})();