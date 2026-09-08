(function(){
  const VERSION='ARENA V14.1';

  function apply(){
    document.body.classList.add('arena-layout-v13');
    document.body.dataset.layoutVersion='14.1';
    if(document.title!==`خلّك رائد | ${VERSION}`)document.title=`خلّك رائد | ${VERSION}`;
    const badge=document.querySelector('.build-badge');
    if(badge&&badge.textContent!==VERSION)badge.textContent=VERSION;
  }

  function init(){
    apply();
    /* مهم: لا نراقب الـ badge بـ MutationObserver.
       الإصدارات القديمة V11/V12 تغيّره أحياناً، والمراقبة كانت تدخل في حلقة تحديث لا نهائية مع V14. */
    setTimeout(apply,650);
    setTimeout(apply,1400);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
  window.addEventListener('load',apply,{once:true});
})();