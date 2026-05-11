(()=>{
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('IntersectionObserver' in window && !reduced){
    const ts=document.querySelectorAll('.gn,.pr,.schedule-grid > *,.visit-grid > *,.tr-card,.sec-head');
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
    },{threshold:.14});
    ts.forEach(el=>io.observe(el));
  }
  // ヒーロー数字のカウントアップ
  const nums=document.querySelectorAll('.hn-v');
  if(nums.length && !reduced){
    nums.forEach(n=>{
      const target=parseInt(n.textContent,10);
      if(!isNaN(target)){
        let cur=0;
        const step=Math.max(1,Math.ceil(target/30));
        const tick=()=>{
          cur+=step;
          if(cur>=target){n.textContent=target;return}
          n.textContent=cur;
          requestAnimationFrame(tick);
        };
        setTimeout(tick,900);
      }
    });
  }
})();
