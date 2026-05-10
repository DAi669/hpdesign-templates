(()=>{
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const cursor = document.querySelector('.cursor-light');
  if(cursor && !reduced && window.matchMedia('(min-width:901px)').matches){
    let tx=0,ty=0,cx=0,cy=0;
    document.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY});
    const tick=()=>{cx+=(tx-cx)*0.15;cy+=(ty-cy)*0.15;cursor.style.left=cx+'px';cursor.style.top=cy+'px';requestAnimationFrame(tick)};
    tick();
    document.querySelectorAll('a,button,.m').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursor.classList.add('lg'));
      el.addEventListener('mouseleave',()=>cursor.classList.remove('lg'));
    });
    const darkObs=new IntersectionObserver(es=>{
      es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>0.4){cursor.classList.add('dark')}else if(!e.isIntersecting){cursor.classList.remove('dark')}});
    },{threshold:[0,0.4,1]});
    document.querySelectorAll('.beans,.ft').forEach(el=>darkObs.observe(el));
  }
  if('IntersectionObserver' in window && !reduced){
    const ts=document.querySelectorAll('.story-grid > *,.beans-grid > *,.info-grid > *,.m,.big-link,.info-card,.menu-head');
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
    },{threshold:.18});
    ts.forEach(el=>io.observe(el));
  }
  const ms=document.querySelector('[data-menu-scroll]');
  if(ms){
    let down=false,startX=0,startScroll=0;
    ms.addEventListener('mousedown',e=>{down=true;startX=e.pageX-ms.offsetLeft;startScroll=ms.scrollLeft});
    ms.addEventListener('mouseleave',()=>down=false);
    ms.addEventListener('mouseup',()=>down=false);
    ms.addEventListener('mousemove',e=>{if(!down)return;e.preventDefault();const x=e.pageX-ms.offsetLeft;ms.scrollLeft=startScroll-(x-startX)*1.4});
  }
})();
