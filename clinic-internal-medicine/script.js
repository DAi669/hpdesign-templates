(()=>{'use strict';
  const r=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('IntersectionObserver' in window && !r){
    const ts=document.querySelectorAll('.dp,.ckp-list li,.reserve-card,.info-grid > *,.about-grid > *,.hero-card');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{es.forEach((e,i)=>{if(e.isIntersecting){e.target.style.opacity='';e.target.classList.add('in-view');e.target.style.animationDelay=(i*50)+'ms';io.unobserve(e.target);}});},{threshold:.16});
    ts.forEach(el=>io.observe(el));
  }
  // 「本日の診療時間」を現在時刻に応じて簡易ハイライト
  const tt=document.querySelector('.today-time');
  if(tt){
    const now=new Date();
    const h=now.getHours();
    const open=(h>=9 && h<13) || (h>=15 && h<18);
    if(open){
      tt.style.color='#1E5288';
      tt.insertAdjacentHTML('afterend','<p style="font-size:12px;color:#5BA67B;margin-top:-12px;margin-bottom:18px;font-weight:600;">◆ 現在 受付中です</p>');
    }
  }
})();
