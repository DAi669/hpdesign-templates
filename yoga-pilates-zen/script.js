(()=>{
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('IntersectionObserver' in window && !reduced){
    // ふわっと現れる要素を観察
    const ts=document.querySelectorAll('.about-grid > *,.cl,.teacher-grid > *,.tr-card,.visit-grid > *,.sec-head');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{
      es.forEach((e,i)=>{
        if(e.isIntersecting){
          e.target.style.opacity='';
          e.target.classList.add('in-view');
          e.target.style.animationDelay=(i*60)+'ms';
          io.unobserve(e.target);
        }
      });
    },{threshold:.16});
    ts.forEach(el=>io.observe(el));
  }
  // ヘッダーのスクロール検知（背景濃度調整）
  const hd=document.querySelector('.hd');
  if(hd){
    let last=0;
    window.addEventListener('scroll',()=>{
      const y=window.scrollY;
      if(y>40 && last<=40){hd.style.boxShadow='0 8px 20px -16px rgba(42,40,32,0.2)'}
      else if(y<=40 && last>40){hd.style.boxShadow=''}
      last=y;
    },{passive:true});
  }
})();
