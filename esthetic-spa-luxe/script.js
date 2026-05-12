// fade-in + ヒーローのパララックス（控えめ）
(()=>{'use strict';
  const r=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('IntersectionObserver' in window && !r){
    const ts=document.querySelectorAll('.m-card,.about-grid > *,.room-grid > *,.reserve-card,.info-grid > *');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{es.forEach((e,i)=>{if(e.isIntersecting){e.target.style.opacity='';e.target.classList.add('in-view');e.target.style.animationDelay=(i*70)+'ms';io.unobserve(e.target);}});},{threshold:.18});
    ts.forEach(el=>io.observe(el));
  }
  // ヒーロー背景の縦パララックス
  const hbg=document.querySelector('.hero-bg');
  if(hbg && !r){
    let raf=null;
    window.addEventListener('scroll',()=>{
      if(raf) return;
      raf=requestAnimationFrame(()=>{
        const y=window.scrollY*0.18;
        hbg.style.transform=`translateY(${y}px)`;
        raf=null;
      });
    },{passive:true});
  }
})();
