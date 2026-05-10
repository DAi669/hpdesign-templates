(()=>{
  'use strict';
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // 3D tilt cards
  if(!reduced && window.matchMedia('(min-width:901px)').matches){
    document.querySelectorAll('[data-tilt]').forEach(el=>{
      const inner=el.querySelector('.himg-i')||el;
      el.addEventListener('mousemove',e=>{
        const r=el.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-0.5;
        const y=(e.clientY-r.top)/r.height-0.5;
        inner.style.transform=`rotateY(${x*-8}deg) rotateX(${y*6}deg) translateZ(8px)`;
      });
      el.addEventListener('mouseleave',()=>{inner.style.transform=''});
    });
  }

  // Magnetic button
  if(!reduced && window.matchMedia('(min-width:901px)').matches){
    document.querySelectorAll('[data-magnet]').forEach(btn=>{
      btn.addEventListener('mousemove',e=>{
        const r=btn.getBoundingClientRect();
        const x=e.clientX-r.left-r.width/2;
        const y=e.clientY-r.top-r.height/2;
        btn.style.transform=`translate(${x*0.18}px, ${y*0.25}px)`;
      });
      btn.addEventListener('mouseleave',()=>{btn.style.transform=''});
    });
  }

  if('IntersectionObserver' in window && !reduced){
    const ts=document.querySelectorAll('.ab-card,.mn-tab,.st,.reserve-card,.info-grid > *,.info-card');
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
