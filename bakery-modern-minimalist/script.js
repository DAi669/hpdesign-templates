(()=>{
  'use strict';
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // Drag-to-scroll + progress bar for today section
  const ms=document.querySelector('[data-scroll]');
  const bar=document.querySelector('.tp-bar');
  if(ms){
    let down=false,startX=0,startScroll=0;
    ms.addEventListener('mousedown',e=>{down=true;startX=e.pageX-ms.offsetLeft;startScroll=ms.scrollLeft});
    ms.addEventListener('mouseleave',()=>down=false);
    ms.addEventListener('mouseup',()=>down=false);
    ms.addEventListener('mousemove',e=>{if(!down)return;e.preventDefault();const x=e.pageX-ms.offsetLeft;ms.scrollLeft=startScroll-(x-startX)*1.4});
    if(bar){
      const updateBar=()=>{
        const max=ms.scrollWidth-ms.clientWidth;
        const pct=Math.max(0.05,Math.min(1,ms.scrollLeft/max));
        bar.style.width=(pct*100)+'%';
      };
      ms.addEventListener('scroll',updateBar,{passive:true});
      updateBar();
    }
  }

  // Reveal on scroll
  if('IntersectionObserver' in window && !reduced){
    const ts=document.querySelectorAll('.td,.info-grid > *,.big-quote,.today-head');
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

/* Burger drawer (multi-page header) — 2026-05-13 */
(()=>{
  'use strict';
  const burger=document.querySelector('.burger');
  const drawer=document.getElementById('drawer');
  if(!burger||!drawer)return;
  let backdrop=document.querySelector('.drawer-backdrop');
  if(!backdrop){
    backdrop=document.createElement('div');
    backdrop.className='drawer-backdrop';
    document.body.appendChild(backdrop);
  }
  const setOpen=(open)=>{
    burger.classList.toggle('is-open',open);
    drawer.classList.toggle('is-open',open);
    backdrop.classList.toggle('is-open',open);
    burger.setAttribute('aria-expanded',String(open));
    document.body.style.overflow=open?'hidden':'';
  };
  burger.addEventListener('click',()=>setOpen(!drawer.classList.contains('is-open')));
  backdrop.addEventListener('click',()=>setOpen(false));
  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
})();
