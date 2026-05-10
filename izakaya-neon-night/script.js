(()=>{
  'use strict';
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // Lantern cursor
  const lan=document.querySelector('.lantern');
  if(lan && !reduced && window.matchMedia('(min-width:901px)').matches){
    let tx=0,ty=0,cx=0,cy=0;
    document.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY});
    const tick=()=>{cx+=(tx-cx)*0.15;cy+=(ty-cy)*0.15;lan.style.left=cx+'px';lan.style.top=cy+'px';requestAnimationFrame(tick)};
    tick();
    document.querySelectorAll('a,button,.mn-col,.sake-grid li').forEach(el=>{
      el.addEventListener('mouseenter',()=>lan.classList.add('lg'));
      el.addEventListener('mouseleave',()=>lan.classList.remove('lg'));
    });
  }

  if('IntersectionObserver' in window && !reduced){
    const ts=document.querySelectorAll('.mn-col,.sake-grid li,.poster-card,.info-grid > *,.info-card,.info-note');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{
      es.forEach((e,i)=>{
        if(e.isIntersecting){
          e.target.style.opacity='';
          e.target.classList.add('in-view');
          e.target.style.animationDelay=(i*40)+'ms';
          io.unobserve(e.target);
        }
      });
    },{threshold:.16});
    ts.forEach(el=>io.observe(el));
  }
})();
