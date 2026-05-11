(()=>{
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('IntersectionObserver' in window && !reduced){
    // セクション内要素の順次出現
    const ts=document.querySelectorAll('.about-grid > *,.tap,.food-grid > *,.visit-grid > *,.sec-head');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{
      es.forEach((e,i)=>{
        if(e.isIntersecting){
          e.target.style.opacity='';
          e.target.classList.add('in-view');
          e.target.style.animationDelay=(i*45)+'ms';
          io.unobserve(e.target);
        }
      });
    },{threshold:.14});
    ts.forEach(el=>io.observe(el));
  }
  // ヘッダーのロゴをホバーで揺らす演出
  const bk=document.querySelector('.brand .bk');
  if(bk){
    bk.addEventListener('mouseenter',()=>{bk.style.transform='rotate(8deg) scale(1.08)';bk.style.transition='transform .35s cubic-bezier(.2,1.4,.4,1)'});
    bk.addEventListener('mouseleave',()=>{bk.style.transform=''});
  }
})();
