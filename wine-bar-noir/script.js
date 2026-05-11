(()=>{
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('IntersectionObserver' in window && !reduced){
    // セクション内の要素を順にふわっと表示
    const ts=document.querySelectorAll('.story-grid > *,.wine-list li,.food-grid > *,.visit-grid > *,.sec-head');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{
      es.forEach((e,i)=>{
        if(e.isIntersecting){
          e.target.style.opacity='';
          e.target.classList.add('in-view');
          e.target.style.animationDelay=(i*50)+'ms';
          io.unobserve(e.target);
        }
      });
    },{threshold:.14});
    ts.forEach(el=>io.observe(el));
  }
  // 営業時間バッジを実時刻ベースで点滅（参考演出）
  const cta=document.querySelector('.hd .cta');
  if(cta){
    const h=new Date().getHours();
    if(h>=18 || h<2){
      cta.style.background=getComputedStyle(document.documentElement).getPropertyValue('--brass');
      cta.style.color='#0E0B0A';
      cta.textContent='OPEN NOW · ' + (h<2?h+24:h) + ':00 –';
    }
  }
})();
