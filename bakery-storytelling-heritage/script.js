(()=>{
  'use strict';
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // Reading progress (fills the rail)
  const fill=document.getElementById('progFill');
  if(fill){
    const upd=()=>{
      const total=document.documentElement.scrollHeight-window.innerHeight;
      const pct=Math.max(0,Math.min(100,(window.scrollY/total)*100));
      fill.style.height=pct+'%';
    };
    document.addEventListener('scroll',upd,{passive:true});
    upd();
  }

  // Chronicle in-view (bullet color change)
  if('IntersectionObserver' in window && !reduced){
    const items=document.querySelectorAll('[data-chapter]');
    const cio=new IntersectionObserver(es=>{
      es.forEach(e=>{
        if(e.isIntersecting && e.intersectionRatio>0.5){e.target.classList.add('in-view')}
      });
    },{threshold:[0,0.5,1]});
    items.forEach(el=>cio.observe(el));

    const ts=document.querySelectorAll('.chr-item,.bf,.info-grid > *');
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
    },{threshold:.15});
    ts.forEach(el=>io.observe(el));
  }
})();

/* Level1 共通モーション add-on (2026-05-12) */
(()=>{
  'use strict';
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const hd=document.querySelector('.hd');
  if(hd){
    const onScroll=()=>hd.classList.toggle('l1-scrolled',window.scrollY>24);
    onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});
  }
  const reveals=document.querySelectorAll('[data-l1-reveal]');
  if('IntersectionObserver' in window && !reduced && reveals.length){
    const io=new IntersectionObserver(es=>{
      es.forEach(e=>{
        if(e.isIntersecting){
          const d=parseInt(e.target.dataset.l1RevealDelay,10)||0;
          setTimeout(()=>e.target.classList.add('is-in'),d);
          io.unobserve(e.target);
        }
      });
    },{threshold:0,rootMargin:'0px 0px -80px 0px'});
    reveals.forEach(el=>io.observe(el));
  } else {
    reveals.forEach(el=>el.classList.add('is-in'));
  }
  const splits=document.querySelectorAll('[data-l1-split]');
  splits.forEach(el=>{
    if(el.dataset.l1SplitDone==='1')return;
    const text=el.textContent;
    el.textContent='';
    [...text].forEach((c,i)=>{
      const s=document.createElement('span');
      s.textContent=c===' '?' ':c;
      s.style.transitionDelay=(i*0.06)+'s';
      el.appendChild(s);
    });
    el.dataset.l1SplitDone='1';
  });
  if('IntersectionObserver' in window && !reduced && splits.length){
    const sio=new IntersectionObserver(es=>{
      es.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('is-in');
          sio.unobserve(e.target);
        }
      });
    },{threshold:0.3});
    splits.forEach(el=>sio.observe(el));
  } else {
    splits.forEach(el=>el.classList.add('is-in'));
  }
  const fab=document.querySelector('.l1-fab');
  if(fab){
    document.body.classList.add('l1-has-fab');
    const onFabScroll=()=>fab.classList.toggle('is-visible',window.scrollY>600);
    onFabScroll();
    window.addEventListener('scroll',onFabScroll,{passive:true});
  }
})();
