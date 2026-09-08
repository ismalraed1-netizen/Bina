(function(){
  function loadScript(src,onload){
    const s=document.createElement('script');
    s.src=src;
    s.onload=onload||null;
    s.onerror=()=>console.error('تعذر تحميل',src);
    document.head.appendChild(s);
  }

  loadScript('image-challenge.js?v=20260908-images1',()=>{
    loadScript('admin-core.js?v=20260908-images1');
  });
})();
