// fade-in + メニュー行のカウントアップ風（ヒーロー数値）
(()=>{'use strict';
  const r=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('IntersectionObserver' in window && !r){
    const ts=document.querySelectorAll('.m-row,.about-grid > *,.shop-grid > *,.reserve-card,.info-grid > *');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{es.forEach((e,i)=>{if(e.isIntersecting){e.target.style.opacity='';e.target.classList.add('in-view');e.target.style.animationDelay=(i*60)+'ms';io.unobserve(e.target);}});},{threshold:.16});
    ts.forEach(el=>io.observe(el));

    // ヒーローのカウントアップ風（25年などの数字を一気に出す簡易演出）
    const nums=document.querySelectorAll('.st-n');
    nums.forEach(n=>{
      const target=n.textContent;
      n.textContent='0';
      const ob=new IntersectionObserver(es=>{
        es.forEach(e=>{
          if(e.isIntersecting){
            const isPlus=target.includes('+');
            const num=parseInt(target,10)||0;
            let cur=0;
            const step=Math.max(1,Math.floor(num/30));
            const tm=setInterval(()=>{
              cur+=step;
              if(cur>=num){cur=num;clearInterval(tm);n.textContent=target;return;}
              n.textContent=cur+(isPlus?'+':'');
            },28);
            ob.unobserve(e.target);
          }
        });
      },{threshold:.6});
      ob.observe(n);
    });
  }
})();
