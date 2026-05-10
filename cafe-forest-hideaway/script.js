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
