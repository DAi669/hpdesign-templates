(()=>{
  'use strict';
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // Lantern cursor
  const lan=document.querySelector('.lantern');
  if(lan && !reduced && window.matchMedia('(min-width:901px)').matches){
    let tx=0,ty=0,cx=0,cy=0;
    document.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY});
    const tick=()=>{cx+=(tx-cx)*0.15;cy+=(ty-cy)*0.15;lan.style.left=cx+'px';lan.style.top=cy+'px';requestAnimationFrame(tick)};
    tick();
    document.querySelectorAll('a,button,.mn-col,.sake-grid li').forEach(el=>{
      el.addEventListener('mouseenter',()=>lan.classList.add('lg'));
      el.addEventListener('mouseleave',()=>lan.classList.remove('lg'));
    });
  }

  if('IntersectionObserver' in window && !reduced){
    const ts=document.querySelectorAll('.mn-col,.sake-grid li,.poster-card,.info-grid > *,.info-card,.info-note');
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
    },{threshold:.16});
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

/* マルチページ拡張: バーガー + ドロワー (2026-05-13) */
(()=>{
  'use strict';
  const burger=document.querySelector('.burger');
  const drawer=document.querySelector('.drawer');
  if(!burger||!drawer)return;
  const toggle=(open)=>{
    const isOpen=open===undefined?!drawer.classList.contains('is-open'):open;
    drawer.classList.toggle('is-open',isOpen);
    burger.classList.toggle('is-open',isOpen);
    document.body.classList.toggle('is-locked',isOpen);
    burger.setAttribute('aria-expanded',String(isOpen));
  };
  burger.addEventListener('click',()=>toggle());
  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggle(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')toggle(false)});
})();
