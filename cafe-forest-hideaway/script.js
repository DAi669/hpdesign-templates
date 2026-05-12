(()=>{
  'use strict';
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // Parallax layers
  const layers=document.querySelectorAll('.hero [data-speed]');
  if(layers.length && !reduced){
    let last=0;
    const onScroll=()=>{
      const y=window.scrollY;
      if(y>window.innerHeight)return;
      layers.forEach(l=>{
        const s=parseFloat(l.dataset.speed||0);
        l.style.transform=`translate3d(0, ${y*s}px, 0)`;
      });
    };
    document.addEventListener('scroll',onScroll,{passive:true});
    onScroll();
  }

  // SVG path draw on scroll into view
  const path=document.getElementById('hpath');
  if(path && !reduced){
    const total=2400;
    const pathObs=new IntersectionObserver(es=>{
      es.forEach(e=>{
        if(e.isIntersecting){
          path.style.transition='stroke-dashoffset 2.5s cubic-bezier(.4,.2,.3,1)';
          path.style.strokeDashoffset='0';
        }
      });
    },{threshold:0.3});
    pathObs.observe(path);
  }

  // Scroll reveal
  if('IntersectionObserver' in window && !reduced){
    const ts=document.querySelectorAll('.ab-grid > *,.b,.v-card,.v-link,.visit dl');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{
      es.forEach((e,i)=>{
        if(e.isIntersecting){
          e.target.style.opacity='';
          e.target.classList.add('in-view');
          e.target.style.animationDelay=(i*60)+'ms';
          io.unobserve(e.target);
        }
      });
    },{threshold:.18});
    ts.forEach(el=>io.observe(el));
  }

  // Image tilt on mousemove
  const tilt=document.querySelector('[data-tilt]');
  if(tilt && !reduced && window.matchMedia('(min-width:901px)').matches){
    const inner=tilt.querySelector('.ab-img-inner');
    tilt.addEventListener('mousemove',e=>{
      const r=tilt.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-0.5;
      const y=(e.clientY-r.top)/r.height-0.5;
      inner.style.transform=`rotateY(${x*-10}deg) rotateX(${y*8}deg) translateZ(20px)`;
    });
    tilt.addEventListener('mouseleave',()=>{inner.style.transform=''});
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
