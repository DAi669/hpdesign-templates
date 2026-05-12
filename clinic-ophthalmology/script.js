(()=>{'use strict';
  const r=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('IntersectionObserver' in window && !r){
    const ts=document.querySelectorAll('.srv,.step-list li,.reserve-card,.info-grid > *,.about-grid > *');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{es.forEach((e,i)=>{if(e.isIntersecting){e.target.style.opacity='';e.target.classList.add('in-view');e.target.style.animationDelay=(i*60)+'ms';io.unobserve(e.target);}});},{threshold:.16});
    ts.forEach(el=>io.observe(el));
  }
  // ヒーローバッジの軽い回転（眼科らしい円のモチーフ）
  const badge=document.querySelector('.hero-badge');
  if(badge && !r){
    let raf=null;
    window.addEventListener('scroll',()=>{
      if(raf) return;
      raf=requestAnimationFrame(()=>{
        const y=window.scrollY*0.04;
        badge.style.transform=`rotate(${y}deg)`;
        raf=null;
      });
    },{passive:true});
  }
})();
