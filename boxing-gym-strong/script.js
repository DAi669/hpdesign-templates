(()=>{
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('IntersectionObserver' in window && !reduced){
    const ts=document.querySelectorAll('.about-grid > *,.co,.tr,.tr-card,.visit-grid > *,.sec-head,.stats-grid > *');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{
      es.forEach((e,i)=>{
        if(e.isIntersecting){
          e.target.style.opacity='';
          e.target.classList.add('in-view');
          e.target.style.animationDelay=(i*45)+'ms';
          io.unobserve(e.target);
        }
      });
    },{threshold:.14});
    ts.forEach(el=>io.observe(el));
  }
  // 統計数字のカウントアップ
  const nums=document.querySelectorAll('.st-num');
  nums.forEach(n=>{
    const raw=n.textContent.trim();
    const m=raw.match(/^(\d+)(%?)$/);
    if(!m)return;
    const target=parseInt(m[1],10);
    const suffix=m[2]||'';
    if(reduced){return}
    let cur=0;
    const step=Math.max(1,Math.ceil(target/40));
    const obs=new IntersectionObserver(es=>{
      es.forEach(e=>{
        if(e.isIntersecting){
          const tick=()=>{
            cur+=step;
            if(cur>=target){n.textContent=target+suffix;return}
            n.textContent=cur+suffix;
            requestAnimationFrame(tick);
          };
          tick();
          obs.unobserve(n);
        }
      });
    },{threshold:.5});
    obs.observe(n);
  });
})();
