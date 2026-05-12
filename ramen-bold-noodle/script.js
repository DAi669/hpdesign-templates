/* =====================================================
   麺屋 たけし - 共通スクリプト
   3ページ (index / menu / story) 共通 JS
   2026-05-12 パイロット改修 (research 指針 Level 1/2/3 全適用)
   vanilla JS のみ・依存なし
   ===================================================== */
(() => {
  'use strict';

  // ユーザーが「アニメーションを減らす」を選んでいるかチェック
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // ---------------------------------------------------
  // 1. 固定ヘッダー: スクロール 24px 超で .is-scrolled
  //    研究指針 Level 1-B
  // ---------------------------------------------------
  const hd = document.querySelector('.hd');
  if (hd) {
    const onScroll = () => {
      hd.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------------------------------------------------
  // 2. スクロール連動フェード (data-reveal)
  //    研究指針 Level 1-A
  // ---------------------------------------------------
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const d = parseInt(e.target.dataset.revealDelay, 10) || 0;
          setTimeout(() => e.target.classList.add('is-in'), d);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach((el) => io.observe(el));
  } else {
    // IO 非対応 or 動き抑制時は即表示
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  // ---------------------------------------------------
  // 3. キネティックタイポ (data-split)
  //    研究指針 Level 2-F
  // ---------------------------------------------------
  const splits = document.querySelectorAll('[data-split]');
  splits.forEach((el) => {
    // 元テキストを取得→1文字ずつ <span> 化
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((c, i) => {
      const s = document.createElement('span');
      s.textContent = c === ' ' ? ' ' : c;
      s.style.transitionDelay = (i * 0.06) + 's';
      el.appendChild(s);
    });
  });
  if ('IntersectionObserver' in window && !reduced && splits.length) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          sio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    splits.forEach((el) => sio.observe(el));
  } else {
    splits.forEach((el) => el.classList.add('is-in'));
  }

  // ---------------------------------------------------
  // 4. ハンバーガーメニュー
  //    研究指針 Level 2-H
  // ---------------------------------------------------
  const burger = document.querySelector('.burger');
  const drawer = document.querySelector('.drawer');
  if (burger && drawer) {
    const close = () => {
      burger.classList.remove('is-open');
      drawer.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      burger.setAttribute('aria-expanded', 'false');
    };
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('is-open');
      drawer.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    // ドロワー内リンククリックで閉じる
    drawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', close);
    });
    // Esc で閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });
  }

  // ---------------------------------------------------
  // 5. 追従CTA: スクロール 400px 超で表示
  //    研究指針 Level 1-D
  // ---------------------------------------------------
  const fab = document.querySelector('.fab-cta');
  if (fab) {
    const onFabScroll = () => {
      fab.classList.toggle('is-visible', window.scrollY > 400);
    };
    onFabScroll();
    window.addEventListener('scroll', onFabScroll, { passive: true });
  }

  // ---------------------------------------------------
  // 6. パララックス背景 (data-parallax)
  //    研究指針 Level 2-G
  //    rAF でスクロールをスロットル
  // ---------------------------------------------------
  const paras = document.querySelectorAll('[data-parallax]');
  if (paras.length && !reduced) {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      paras.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        // 要素位置を考慮 (要素が画面外に入ってきた量にのみ反応)
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + window.scrollY - window.innerHeight) * -1 + y;
        el.style.transform = `translate3d(0, ${(y - (rect.top + y - window.innerHeight)) * speed * 0.1}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  // ---------------------------------------------------
  // 7. 旧 .m-card / .story-grid 等のフェード (後方互換)
  //    既存テンプレで data-reveal が付いてない要素もケア
  // ---------------------------------------------------
  if ('IntersectionObserver' in window && !reduced) {
    const legacy = document.querySelectorAll('.m-card:not([data-reveal]),.topping:not([data-reveal]),.info-stamp:not([data-reveal])');
    if (legacy.length) {
      legacy.forEach((el) => { el.style.opacity = '0'; });
      const lio = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            e.target.style.opacity = '';
            e.target.classList.add('in-view');
            e.target.style.animationDelay = (i * 60) + 'ms';
            lio.unobserve(e.target);
          }
        });
      }, { threshold: 0.16 });
      legacy.forEach((el) => lio.observe(el));
    }
  }

})();
