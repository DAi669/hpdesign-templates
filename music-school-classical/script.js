(()=>{'use strict';
  const r=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('IntersectionObserver' in window && !r){
    const ts=document.querySelectorAll('.ls,.tc,.reserve-card,.info-grid > *,.about-grid > *');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{es.forEach((e,i)=>{if(e.isIntersecting){e.target.style.opacity='';e.target.classList.add('in-view');e.target.style.animationDelay=(i*70)+'ms';io.unobserve(e.target);}});},{threshold:.18});
    ts.forEach(el=>io.observe(el));

    // ヒーロー数字のカウントアップ
    const nums=document.querySelectorAll('.hm-n');
    nums.forEach(n=>{
      const target=n.textContent;
      const isPlus=target.includes('+');
      const num=parseInt(target,10)||0;
      const ob=new IntersectionObserver(es=>{
        es.forEach(e=>{
          if(e.isIntersecting){
            let cur=0;
            const step=Math.max(1,Math.ceil(num/24));
            const tm=setInterval(()=>{
              cur+=step;
              if(cur>=num){cur=num;clearInterval(tm);n.textContent=target;return;}
              n.textContent=cur+(isPlus?'+':'');
            },36);
            ob.unobserve(e.target);
          }
        });
      },{threshold:.7});
      ob.observe(n);
    });
  }
})();
