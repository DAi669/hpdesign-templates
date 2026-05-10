(()=>{
  'use strict';
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const bar=document.getElementById('rbar');
  if(bar){
    const updateProgress=()=>{
      const h=document.documentElement;
      const total=h.scrollHeight-h.clientHeight;
      const pct=Math.max(0,Math.min(100,(h.scrollTop/total)*100));
      bar.style.width=pct+'%';
    };
    document.addEventListener('scroll',updateProgress,{passive:true});
    updateProgress();
  }
  if('IntersectionObserver' in window && !reduced){
    const ts=document.querySelectorAll('.chap-body > *,.book,.sweets-list li,.cv-cap,.ed-table tr');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{
      es.forEach((e,i)=>{
        if(e.isIntersecting){
          e.target.style.opacity='';
          e.target.classList.add('in-view');
          e.target.style.animationDelay=(i*30)+'ms';
          io.unobserve(e.target);
        }
      });
    },{threshold:.18});
    ts.forEach(el=>io.observe(el));
  }
})();
