/* =====================================================
   Level 1 共通モーション JS (vanilla / 依存なし)
   2026-05-12 - 9テンプレ横展開用
   M1 reveal / M2 header shrink / M3 ken burns (CSS側)
   M4 split text / M5 fab
   ===================================================== */
(() => {
  'use strict';

  // ユーザーが「アニメーション減らす」設定をしているかチェック
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // ---------------------------------------------------
  // M2. 固定ヘッダ縮小: scrollY > 24 で .is-scrolled
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
  // M1. data-reveal 自動付与 + IntersectionObserver
  // 主要セクション/カード相当の要素に自動で data-reveal を付ける
  // ---------------------------------------------------
  const autoRevealSelectors = [
    // ヒーロー直後の主要セクション (テンプレ間で名称ばらばらなので幅広に拾う)
    'section:not(.hero) > .cont > *',
    'section:not(.hero) > .cont',
    'section.about > *',
    'section.story > *',
    'section.menu > *',
    'section.wine > *',
    'section.food > *',
    'section.visit > *',
    'section.taps > *',
    'section.course > *',
    'section.tea > *',
    'section.process > *',
    'section.flavors > *',
    'section.season > *',
    'section.class > *',
    'section.teacher > *',
    'section.program > *',
    'section.price > *',
    'section.trial > *',
    'section.trainer > *',
    // カード/リスト要素
    '.c-card', '.m-card', '.wine-list li', '.food-list li',
    '.menu-row', '.tl-item', '.gallery-grid figure',
    // セクション見出し
    '.sec-head', '.sec-h', 'h2',
  ];

  // 既存 [data-reveal] を持つ要素はそのまま、ない要素にだけ付与
  autoRevealSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      // ヒーロー内部は除外 (ヒーローは別アニメ)
      if (el.closest('.hero')) return;
      // ヘッダ/フッタは除外
      if (el.closest('.hd') || el.closest('.ft') || el.closest('footer')) return;
      // FAB は除外
      if (el.closest('.m-fab')) return;
      // すでに data-reveal が付いていればスキップ
      if (el.hasAttribute('data-reveal')) return;
      el.setAttribute('data-reveal', '');
    });
  });

  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -80px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  // ---------------------------------------------------
  // M4. キネティックタイポ (data-split)
  // hero-h 内の .line / 直接テキストノード を文字単位 <span> 化
  // ※ 既存の .line アニメと衝突しないよう、data-split-skip 属性で無効化可能
  // ---------------------------------------------------
  // ヒーロータイトルに自動で data-split を付与する場合はここで条件付与
  // → 既存テンプレの .line には独自アニメが付いているものが多いので、
  //    自動付与は避けて「明示的に data-split が付いた要素のみ」を対象とする
  const splits = document.querySelectorAll('[data-split]');
  splits.forEach((el) => {
    // 既に span 化済みならスキップ
    if (el.dataset.splitDone === '1') return;
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((c, i) => {
      const s = document.createElement('span');
      s.textContent = c === ' ' ? ' ' : c;
      s.style.transitionDelay = (i * 0.06) + 's';
      el.appendChild(s);
    });
    el.dataset.splitDone = '1';
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
  // M5. 追従CTA (FAB)
  // body 末尾に動的に挿入 / scrollY > 600 で表示
  // ※ HTML に <div class="m-fab">...</div> が既にあれば再利用
  // 内容はテンプレの window.M_FAB 設定 or デフォルト
  // ---------------------------------------------------
  let fab = document.querySelector('.m-fab');
  if (!fab) {
    // デフォルト設定: 予約 + 電話
    const cfg = (window.M_FAB && typeof window.M_FAB === 'object') ? window.M_FAB : {
      primary: { label: 'ご予約', href: '#visit' },
      secondary: { label: '電話', href: 'tel:', ic: 'CALL' },
    };
    fab = document.createElement('div');
    fab.className = 'm-fab';
    fab.setAttribute('aria-label', '追従アクション');
    const a1 = document.createElement('a');
    a1.className = 'm-fab-primary';
    a1.href = cfg.primary.href || '#';
    a1.textContent = cfg.primary.label || 'ご予約';
    fab.appendChild(a1);
    if (cfg.secondary) {
      const a2 = document.createElement('a');
      a2.className = 'm-fab-secondary';
      a2.href = cfg.secondary.href || '#';
      a2.innerHTML = (cfg.secondary.ic ? '<span class="ic">' + cfg.secondary.ic + '</span> ' : '') + (cfg.secondary.label || '電話');
      fab.appendChild(a2);
    }
    document.body.appendChild(fab);
    document.body.classList.add('has-fab-bar');
  }

  const onFabScroll = () => {
    fab.classList.toggle('is-visible', window.scrollY > 600);
  };
  onFabScroll();
  window.addEventListener('scroll', onFabScroll, { passive: true });

})();
