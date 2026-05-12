(()=>{'use strict';
  const r=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('IntersectionObserver' in window && !r){
    const ts=document.querySelectorAll('.cl,.gi,.reserve-card,.info-grid > *,.about-grid > *,.trial-card');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{es.forEach((e,i)=>{if(e.isIntersecting){e.target.style.opacity='';e.target.classList.add('in-view');e.target.style.animationDelay=(i*60)+'ms';io.unobserve(e.target);}});},{threshold:.16});
    ts.forEach(el=>io.observe(el));
  }
  // ギャラリー画像をマウス追従で軽く回転（クラフト感）
  const gis=document.querySelectorAll('.gi');
  if(!r){
    gis.forEach((g,i)=>{
      const offset=((i%3)-1)*0.8; // -0.8 / 0 / 0.8 deg
      g.style.transform=`rotate(${offset}deg)`;
    });
  }
})();
