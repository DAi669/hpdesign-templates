(()=>{'use strict';
  const r=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('IntersectionObserver' in window && !r){
    const ts=document.querySelectorAll('.tb,.mth-list li,.reserve-card,.info-grid > *,.about-grid > *,.price-banner');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{es.forEach((e,i)=>{if(e.isIntersecting){e.target.style.opacity='';e.target.classList.add('in-view');e.target.style.animationDelay=(i*60)+'ms';io.unobserve(e.target);}});},{threshold:.16});
    ts.forEach(el=>io.observe(el));
  }
  // 背骨SVG: スクロールで微回転（業種固有の動き）
  const spine=document.querySelector('.spine-svg-wrap svg');
  if(spine && !r){
    let raf=null;
    window.addEventListener('scroll',()=>{
      if(raf) return;
      raf=requestAnimationFrame(()=>{
        const sc=Math.min(1,window.scrollY/600);
        spine.style.transform=`rotate(${sc*8 - 4}deg) scale(${1 + sc*0.04})`;
        raf=null;
      });
    },{passive:true});
  }
})();
