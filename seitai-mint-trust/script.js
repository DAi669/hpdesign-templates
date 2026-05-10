(()=>{
  'use strict';
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // Show FAB after scroll
  const fab=document.getElementById('fab');
  if(fab){
    const sh=()=>{if(window.scrollY>200){fab.classList.add('shown')}else{fab.classList.remove('shown')}};
    document.addEventListener('scroll',sh,{passive:true});
    sh();
  }

  // Counter animation (count up to data-count-to)
  const counters=document.querySelectorAll('[data-counter]');
  if(counters.length && !reduced){
    const cio=new IntersectionObserver(es=>{
      es.forEach(e=>{
        if(e.isIntersecting){
          const num=e.target.querySelector('.s-num');
          if(!num||num.dataset.done)return;
          const to=parseInt(num.dataset.countTo,10);
          const dur=1500;const start=performance.now();
          const tick=t=>{
            const el=Math.min(1,(t-start)/dur);
            const ease=1-Math.pow(1-el,3);
            num.textContent=Math.round(to*ease).toLocaleString();
            if(el<1){requestAnimationFrame(tick)}else{num.dataset.done='1'}
          };
          requestAnimationFrame(tick);
          cio.unobserve(e.target);
        }
      });
    },{threshold:.5});
    counters.forEach(c=>cio.observe(c));
  } else {
    counters.forEach(c=>{const n=c.querySelector('.s-num');if(n)n.textContent=parseInt(n.dataset.countTo,10).toLocaleString()});
  }

  // Accordion FAQ
  document.querySelectorAll('[data-acc]').forEach(item=>{
    const btn=item.querySelector('.fq-q');
    if(btn)btn.addEventListener('click',()=>item.classList.toggle('open'));
  });

  if('IntersectionObserver' in window && !reduced){
    const ts=document.querySelectorAll('.sm,.fl-list li,.pr,.fq,.reserve-card,.info-grid > *,.ha-card');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{
      es.forEach((e,i)=>{
        if(e.isIntersecting){
          e.target.style.opacity='';
          e.target.classList.add('in-view');
          e.target.style.animationDelay=(i*30)+'ms';
          io.unobserve(e.target);
        }
      });
    },{threshold:.16});
    ts.forEach(el=>io.observe(el));
  }
})();
