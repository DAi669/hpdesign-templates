// POP-UP TOKYO 2026 - 期間カウントダウン + リビール
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== カウントダウン（会期スタートまで）=====
  const cd = document.getElementById('countdown');
  if (cd) {
    const target = new Date(cd.dataset.target);
    const cells = {
      days: cd.querySelector('[data-cd="days"]'),
      hours: cd.querySelector('[data-cd="hours"]'),
      minutes: cd.querySelector('[data-cd="minutes"]'),
      seconds: cd.querySelector('[data-cd="seconds"]')
    };
    function pad(n, len) { return String(Math.max(0, n)).padStart(len, '0'); }
    function tick() {
      const diff = target - new Date();
      if (diff <= 0) {
        // 会期スタート後は 000:00:00:00 で停止（過去日付の負数を防ぐ）
        cells.days.textContent = '000';
        cells.hours.textContent = '00';
        cells.minutes.textContent = '00';
        cells.seconds.textContent = '00';
        return;
      }
      const sec = Math.floor(diff / 1000);
      cells.days.textContent = pad(Math.floor(sec / 86400), 3);
      cells.hours.textContent = pad(Math.floor((sec % 86400) / 3600), 2);
      cells.minutes.textContent = pad(Math.floor((sec % 3600) / 60), 2);
      cells.seconds.textContent = pad(sec % 60, 2);
    }
    tick();
    setInterval(tick, 1000);
  }

  // ===== スクロールリビール =====
  if ('IntersectionObserver' in window && !reduced) {
    const targets = document.querySelectorAll('.about-grid, .kpi-cell, .br-card, .pr-row, .tk-card, .access-grid');
    targets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity .85s cubic-bezier(.2,.8,.2,1), transform .85s cubic-bezier(.2,.8,.2,1)';
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => {
            e.target.style.opacity = '1';
            e.target.style.transform = '';
          }, i * 35);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(el => io.observe(el));
  }

  // ===== スムーススクロール =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const t = document.querySelector(id);
        if (t) {
          ev.preventDefault();
          t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        }
      }
    });
  });
})();
