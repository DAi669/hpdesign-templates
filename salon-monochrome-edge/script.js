(()=>{
  'use strict';
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // Cursor glow follow
  const glow=document.querySelector('.cursor-glow');
  if(glow && !reduced && window.matchMedia('(min-width:901px)').matches){
    let tx=0,ty=0,cx=0,cy=0;
    document.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY+window.scrollY});
    const tick=()=>{cx+=(tx-cx)*0.12;cy+=(ty-cy)*0.12;glow.style.transform=`translate(${cx}px, ${cy-window.scrollY}px) translate(-50%,-50%)`;requestAnimationFrame(tick)};
    tick();
  }

  // Live clock in header
  const clock=document.getElementById('clock');
  if(clock){
    const tick=()=>{
      const d=new Date();
      const pad=n=>String(n).padStart(2,'0');
      clock.textContent=`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      requestAnimationFrame(tick);
    };
    tick();
  }

  // Text scramble on load
  if(!reduced){
    const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%';
    const scramble=el=>new Promise(res=>{
      const orig=el.textContent;
      const len=orig.length;
      let frame=0;
      const t=setInterval(()=>{
        let out='';
        for(let i=0;i<len;i++){
          if(i<frame*1.4){out+=orig[i]}
          else if(orig[i]===' '){out+=' '}
          else{out+=chars[Math.floor(Math.random()*chars.length)]}
        }
        el.textContent=out;
        frame++;
        if(frame>=len){clearInterval(t);el.textContent=orig;res()}
      },35);
    });
    document.querySelectorAll('[data-scramble]').forEach((el,i)=>{
      setTimeout(()=>scramble(el),200+i*200);
    });
  }

  // Hamburger drawer (multi-page header)
  const burger=document.querySelector('.burger');
  const drawer=document.querySelector('.drawer');
  if(burger && drawer){
    const close=()=>{
      burger.classList.remove('is-open');
      drawer.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      burger.setAttribute('aria-expanded','false');
    };
    burger.addEventListener('click',()=>{
      const open=burger.classList.toggle('is-open');
      drawer.classList.toggle('is-open',open);
      document.body.classList.toggle('is-locked',open);
      burger.setAttribute('aria-expanded',String(open));
    });
    drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape' && drawer.classList.contains('is-open')) close();
    });
  }

  if('IntersectionObserver' in window && !reduced){
    const ts=document.querySelectorAll('.wow-item,.cr,.book-card,.menu-tbl tr,.info-grid > *,.i-card,.menu-detail tr,.sd-grid,.sp-chap');
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
