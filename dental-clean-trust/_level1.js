/* =====================================================
   Level 1 共通モーション (5モーション)
   2026-05-12 batch3 Level1 横展開 (software-engineer-a)
   既存 script.js とは別 IIFE。既存挙動には触らない
   ===================================================== */
(() => {
  'use strict';

  // ユーザーが「アニメーションを減らす」を選んでいるかチェック
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // ---------------------------------------------------
  // M2. 固定ヘッダ縮小: scroll > 24px で .is-scrolled
  // ---------------------------------------------------
  const hd = document.querySelector('header.hd, .hd');
  if (hd) {
    const onScroll = () => {
      hd.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------------------------------------------------
  // M3. ヒーロー Ken Burns: 最初の .hero に .is-kenburns を付与
  //     既存に背景画像レイヤー(.hero-img/.hero-bg/.hero-photo)があれば
  //     CSS でゆっくりズームが効く
  // ---------------------------------------------------
  const hero = document.querySelector('.hero');
  if (hero && !reduced) {
    hero.classList.add('is-kenburns');
  }

  // ---------------------------------------------------
  // M1. スクロール連動フェード (data-reveal)
  //     セクション・カード・主要ブロックに自動付与
  // ---------------------------------------------------
  // 自動付与対象: 主要セクション/カード系の class を持つ要素
  // 既存テンプレで未指定の場合に自動マーキング
  const autoTargets = document.querySelectorAll(
    'section:not(.hero) > .cont, section:not(.hero) > .container, ' +
    '.ab-card, .mn-tab, .st, .info-card, ' +              // salon系
    '.feature-card, .stat, .testimonial, .pricing, ' +    // 共通
    '.service, .doctor, .step, .access-card, ' +          // clinic系
    '.menu-card, .menu-row, .card, ' +                    // 汎用
    '.timeline-item, .gallery-item, .story-block'         // story/timeline
  );
  autoTargets.forEach((el) => {
    if (!el.hasAttribute('data-reveal') && !el.classList.contains('in-view')) {
      el.setAttribute('data-reveal', '');
    }
  });

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
    }, { threshold: 0.1 });
    reveals.forEach((el) => io.observe(el));
  } else {
    // IO 非対応 or 動き抑制時は即表示
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  // ---------------------------------------------------
  // M4. キネティックタイポ: .hero-h を自動 split
  //     既存 .hero-h 配下のテキストノードを1文字ずつ span 化
  // ---------------------------------------------------
  const splitTarget = document.querySelector('.hero-h');
  if (splitTarget && !splitTarget.hasAttribute('data-split')) {
    splitTarget.setAttribute('data-split', '');
  }

  const splits = document.querySelectorAll('[data-split]');
  splits.forEach((el) => {
    // すでに lvl1 split 済みならスキップ (二重防止)
    if (el.dataset.lvl1Split === '1') return;

    // 子要素 (span line/em 等) を保持しつつ、テキストノードのみ文字分割
    const walk = (node) => {
      const children = Array.from(node.childNodes);
      children.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent;
          if (!text.trim()) return;
          const frag = document.createDocumentFragment();
          [...text].forEach((c, i) => {
            const s = document.createElement('span');
            s.className = 'lvl1-c';
            s.textContent = c === ' ' ? ' ' : c;
            s.style.transitionDelay = (i * 0.05) + 's';
            frag.appendChild(s);
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          // ネスト要素は再帰
          walk(child);
        }
      });
    };
    walk(el);
    el.dataset.lvl1Split = '1';
  });

  if ('IntersectionObserver' in window && !reduced && splits.length) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          sio.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    splits.forEach((el) => sio.observe(el));
  } else {
    splits.forEach((el) => el.classList.add('is-in'));
  }

  // ---------------------------------------------------
  // M5. 追従CTA: scroll > 600px で表示
  //     既存に .fab-cta が無い場合のみ動的注入
  // ---------------------------------------------------
  const existingFab = document.querySelector('.fab-cta, .lvl1-fab');
  if (!existingFab) {
    // 既存テンプレから「予約」「相談」「お問合せ」相当のリンクを探す
    // 見つかれば そのhref を流用、なければ #top にフォールバック
    const candidate = document.querySelector(
      'a[href*="reserve"], a[href*="contact"], a[href*="booking"], ' +
      'a[href*="#reserve"], a[href*="#contact"], a[href*="#booking"], ' +
      'a[href*="#access"], a[href*="tel:"]'
    );
    const href = candidate ? candidate.getAttribute('href') : '#';
    const label = '予約・お問い合わせ';

    const fab = document.createElement('div');
    fab.className = 'lvl1-fab';
    fab.setAttribute('aria-hidden', 'false');
    fab.innerHTML = '<a href="' + href + '">' + label + '</a>';
    document.body.appendChild(fab);
    document.body.classList.add('has-lvl1-fab');

    const onFabScroll = () => {
      fab.classList.toggle('is-visible', window.scrollY > 600);
    };
    onFabScroll();
    window.addEventListener('scroll', onFabScroll, { passive: true });
  }

})();
