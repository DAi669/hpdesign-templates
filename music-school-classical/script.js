(()=>{'use strict';
  const r=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('IntersectionObserver' in window && !r){
    const ts=document.querySelectorAll('.ls,.tc,.reserve-card,.info-grid > *,.about-grid > *');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{es.forEach((e,i)=>{if(e.isIntersecting){e.target.style.opacity='';e.target.classList.add('in-view');e.target.style.animationDelay=(i*70)+'ms';io.unobserve(e.target);}});},{threshold:.18});
    ts.forEach(el=>io.observe(el));

    // ヒーロー数字のカウントアップ
    const nums=document.querySelectorAll('.hm-n');
    nums.forEach(n=>{
      const target=n.textContent;
      const isPlus=target.includes('+');
      const num=parseInt(target,10)||0;
      const ob=new IntersectionObserver(es=>{
        es.forEach(e=>{
          if(e.isIntersecting){
            let cur=0;
            const step=Math.max(1,Math.ceil(num/24));
            const tm=setInterval(()=>{
              cur+=step;
              if(cur>=num){cur=num;clearInterval(tm);n.textContent=target;return;}
              n.textContent=cur+(isPlus?'+':'');
            },36);
            ob.unobserve(e.target);
          }
        });
      },{threshold:.7});
      ob.observe(n);
    });
  }

  // ===== Level1 共通5モーション (2026-05-12 batch4 追加) =====
  // M1: [data-reveal]
  const rv=document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window && !r && rv.length){
    const rio=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){const d=parseInt(e.target.dataset.revealDelay,10)||0;setTimeout(()=>e.target.classList.add('is-in'),d);rio.unobserve(e.target);}});},{threshold:.15});
    rv.forEach(el=>rio.observe(el));
  } else { rv.forEach(el=>el.classList.add('is-in')); }

  // M2: 固定ヘッダ縮小
  const hd=document.querySelector('.hd');
  if(hd){
    const onSc=()=>hd.classList.toggle('is-scrolled',window.scrollY>24);
    onSc(); window.addEventListener('scroll',onSc,{passive:true});
  }

  // M3: ヒーロー画像背景なし(SVG五線譜のみ) → Ken Burns 適用見送り

  // M4: ヒーロー h1 は .line 未分割 → M4 適用見送り

  // M5: 追従CTA
  if(!document.querySelector('.l1-fab')){
    const fab=document.createElement('a');
    fab.href='#reserve'; fab.className='l1-fab'; fab.textContent='体験レッスン';
    fab.style.background='var(--gold,#B89656)';
    document.body.appendChild(fab);
    const onFab=()=>fab.classList.toggle('is-visible',window.scrollY>600);
    onFab(); window.addEventListener('scroll',onFab,{passive:true});
  }
})();
