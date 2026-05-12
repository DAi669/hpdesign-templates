(()=>{'use strict';
  const r=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if('IntersectionObserver' in window && !r){
    const ts=document.querySelectorAll('.tb,.mth-list li,.reserve-card,.info-grid > *,.about-grid > *,.price-banner');
    ts.forEach(el=>el.style.opacity='0');
    const io=new IntersectionObserver(es=>{es.forEach((e,i)=>{if(e.isIntersecting){e.target.style.opacity='';e.target.classList.add('in-view');e.target.style.animationDelay=(i*60)+'ms';io.unobserve(e.target);}});},{threshold:.16});
    ts.forEach(el=>io.observe(el));
  }
  // 背骨SVG: スクロールで微回転（業種固有の動き）
  const spine=document.querySelector('.spine-svg-wrap svg');
  if(spine && !r){
    let raf=null;
    window.addEventListener('scroll',()=>{
      if(raf) return;
      raf=requestAnimationFrame(()=>{
        const sc=Math.min(1,window.scrollY/600);
        spine.style.transform=`rotate(${sc*8 - 4}deg) scale(${1 + sc*0.04})`;
        raf=null;
      });
    },{passive:true});
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

  // M3: ヒーロー画像背景なし(SVG装飾のみ) → Ken Burns 適用見送り

  // M4: ヒーロー .line は未分割 → M4 適用見送り (既存マークアップ保持)

  // M5: 追従CTA
  if(!document.querySelector('.l1-fab')){
    const fab=document.createElement('a');
    fab.href='#reserve'; fab.className='l1-fab'; fab.textContent='体験予約';
    fab.style.background='var(--primary,#3C5468)';
    document.body.appendChild(fab);
    const onFab=()=>fab.classList.toggle('is-visible',window.scrollY>600);
    onFab(); window.addEventListener('scroll',onFab,{passive:true});
  }
})();
