(()=>{
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const cursor = document.querySelector('.cursor-light');
  if(cursor && !reduced && window.matchMedia('(min-width:901px)').matches){
    let tx=0,ty=0,cx=0,cy=0;
    document.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY});
    const tick=()=>{cx+=(tx-cx)*0.15;cy+=(ty-cy)*0.15;cursor.style.left=cx+'px';cursor.style.top=cy+'px';requestAnimationFrame(tick)};
    tick();
    document.querySelectorAll('a,button,.m').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursor.classList.add('lg'));
      el.addEventListener('mouseleave',()=>cursor.classList.remove('lg'));
    });
    const darkObs=new IntersectionObserver(es=>{
      es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>0.4){cursor.classList.add('dark')}else if(!e.isIntersecting){cursor.classList.remove('dark')}});
    },{threshold:[0,0.4,1]});
    document.querySelectorAll('.beans,.ft').forEach(el=>darkObs.observe(el));
  }
  if('IntersectionObserver' in window && !reduced){
    const ts=document.querySelectorAll('.story-grid > *,.beans-grid > *,.info-grid > *,.m,.big-link,.info-card,.menu-head');
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
    },{threshold:.18});
    ts.forEach(el=>io.observe(el));
  }
  const ms=document.querySelector('[data-menu-scroll]');
  if(ms){
    let down=false,startX=0,startScroll=0;
    ms.addEventListener('mousedown',e=>{down=true;startX=e.pageX-ms.offsetLeft;startScroll=ms.scrollLeft});
    ms.addEventListener('mouseleave',()=>down=false);
    ms.addEventListener('mouseup',()=>down=false);
    ms.addEventListener('mousemove',e=>{if(!down)return;e.preventDefault();const x=e.pageX-ms.offsetLeft;ms.scrollLeft=startScroll-(x-startX)*1.4});
  }
})();

/* =====================================================
   Level1 共通モーション add-on (2026-05-12)
   ramen-bold-noodle 手本ベース・全テンプレ共通
   M1: data-l1-reveal / M2: .hd.l1-scrolled / M3: .l1-kenburns
   M4: data-l1-split / M5: .l1-fab
   ===================================================== */
(()=>{
  'use strict';
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // M2: ヘッダ縮小
  const hd=document.querySelector('.hd');
  if(hd){
    const onScroll=()=>hd.classList.toggle('l1-scrolled',window.scrollY>24);
    onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});
  }

  // M1: スクロール連動フェード ([data-l1-reveal])
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

  // M4: キネティックタイポ ([data-l1-split])
  const splits=document.querySelectorAll('[data-l1-split]');
  splits.forEach(el=>{
    if(el.dataset.l1SplitDone==='1')return;
    const text=el.textContent;
    el.textContent='';
    [...text].forEach((c,i)=>{
      const s=document.createElement('span');
      s.textContent=c===' '?' ':c;
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

  // M5: 追従CTA
  const fab=document.querySelector('.l1-fab');
  if(fab){
    document.body.classList.add('l1-has-fab');
    const onFabScroll=()=>fab.classList.toggle('is-visible',window.scrollY>600);
    onFabScroll();
    window.addEventListener('scroll',onFabScroll,{passive:true});
  }
})();
