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
