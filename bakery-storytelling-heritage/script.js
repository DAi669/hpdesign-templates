(()=>{
  'use strict';
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // Reading progress (fills the rail)
  const fill=document.getElementById('progFill');
  if(fill){
    const upd=()=>{
      const total=document.documentElement.scrollHeight-window.innerHeight;
      const pct=Math.max(0,Math.min(100,(window.scrollY/total)*100));
      fill.style.height=pct+'%';
    };
    document.addEventListener('scroll',upd,{passive:true});
    upd();
  }

  // Chronicle in-view (bullet color change)
  if('IntersectionObserver' in window && !reduced){
    const items=document.querySelectorAll('[data-chapter]');
    const cio=new IntersectionObserver(es=>{
      es.forEach(e=>{
        if(e.isIntersecting && e.intersectionRatio>0.5){e.target.classList.add('in-view')}
      });
    },{threshold:[0,0.5,1]});
    items.forEach(el=>cio.observe(el));

    const ts=document.querySelectorAll('.chr-item,.bf,.info-grid > *');
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
    },{threshold:.15});
    ts.forEach(el=>io.observe(el));
  }
})();
