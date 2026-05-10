(()=>{
  'use strict';
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // Typewriter effect on hero eyebrow
  const tw=document.querySelector('[data-typewriter]');
  if(tw && !reduced){
    const txt=tw.textContent;
    tw.textContent='';
    let i=0;
    const startTw=()=>{
      const t=setInterval(()=>{
        tw.textContent=txt.slice(0,i+1);
        i++;
        if(i>=txt.length){clearInterval(t)}
      },80);
    };
    setTimeout(startTw,300);
  }

  // Clip-path image reveal on hero load
  if(!reduced){
    setTimeout(()=>{
      document.querySelectorAll('[data-reveal]').forEach(el=>el.classList.add('shown'));
    },200);
  } else {
    document.querySelectorAll('[data-reveal]').forEach(el=>{el.style.clipPath='none'});
  }

  // Reveal on scroll
  if('IntersectionObserver' in window && !reduced){
    const ts=document.querySelectorAll('.br,.proc-list li,.info-grid > *,.sec-head');
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
    },{threshold:.2});
    ts.forEach(el=>io.observe(el));
  }
})();
