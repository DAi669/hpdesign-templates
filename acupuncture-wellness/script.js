(()=>{
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('IntersectionObserver' in window && !reduced){
    const ts=document.querySelectorAll('.about-grid > *,.sy,.fl-list li,.book-grid > *,.sec-head');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{
      es.forEach((e,i)=>{
        if(e.isIntersecting){
          e.target.style.opacity='';
          e.target.classList.add('in-view');
          e.target.style.animationDelay=(i*55)+'ms';
          io.unobserve(e.target);
        }
      });
    },{threshold:.15});
    ts.forEach(el=>io.observe(el));
  }

  // ===== Level1 共通5モーション (2026-05-12 batch4 追加) =====
  // M1: [data-reveal] スクロール連動フェード
  const rv=document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window && !reduced && rv.length){
    const rio=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){const d=parseInt(e.target.dataset.revealDelay,10)||0;setTimeout(()=>e.target.classList.add('is-in'),d);rio.unobserve(e.target);}});},{threshold:.15});
    rv.forEach(el=>rio.observe(el));
  } else { rv.forEach(el=>el.classList.add('is-in')); }

  // M2: 固定ヘッダ縮小 (scroll > 24px)
  const hd=document.querySelector('.hd');
  if(hd){
    const onSc=()=>hd.classList.toggle('is-scrolled',window.scrollY>24);
    onSc(); window.addEventListener('scroll',onSc,{passive:true});
  }

  // M3: ヒーロー Ken Burns (.hero-bg)
  const heroBg=document.querySelector('.hero-bg');
  if(heroBg && !reduced) heroBg.classList.add('l1-kenburns');

  // M4: キネティックタイポ (ヒーロー .line を行単位スライド)
  const lines=document.querySelectorAll('.hero h1.hero-h .line');
  if(lines.length && !reduced){
    lines.forEach((el,i)=>{ el.classList.add('l1-line'); el.style.transitionDelay=(i*0.14)+'s'; });
    requestAnimationFrame(()=>lines.forEach(el=>el.classList.add('is-in')));
  }

  // M5: 追従CTA (scroll > 600px で表示)
  if(!document.querySelector('.l1-fab')){
    const fab=document.createElement('a');
    fab.href='#book'; fab.className='l1-fab'; fab.textContent='ご予約';
    fab.style.background='var(--shu,#B23C28)';
    document.body.appendChild(fab);
    const onFab=()=>fab.classList.toggle('is-visible',window.scrollY>600);
    onFab(); window.addEventListener('scroll',onFab,{passive:true});
  }
})();
