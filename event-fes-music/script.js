// 夏フェス 海風 2026 - フェス開幕までのカウントダウン
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== カウントダウン =====
  const cd = document.getElementById('countdown');
  if (cd) {
    const target = new Date(cd.dataset.target);
    const cells = {
      days: cd.querySelector('[data-cd="days"]'),
      hours: cd.querySelector('[data-cd="hours"]'),
      minutes: cd.querySelector('[data-cd="minutes"]'),
      seconds: cd.querySelector('[data-cd="seconds"]')
    };
    function pad(n, l) { return String(Math.max(0, n)).padStart(l, '0'); }
    function tick() {
      const diff = target - new Date();
      if (diff <= 0) {
        cells.days.textContent = '000'; cells.hours.textContent = '00';
        cells.minutes.textContent = '00'; cells.seconds.textContent = '00';
        return;
      }
      const s = Math.floor(diff / 1000);
      cells.days.textContent = pad(Math.floor(s / 86400), 3);
      cells.hours.textContent = pad(Math.floor((s % 86400) / 3600), 2);
      cells.minutes.textContent = pad(Math.floor((s % 3600) / 60), 2);
      cells.seconds.textContent = pad(s % 60, 2);
    }
    tick();
    setInterval(tick, 1000);
  }

  // ===== スクロールリビール =====
  if ('IntersectionObserver' in window && !reduced) {
    const targets = document.querySelectorAll('.about-grid, .ln-day, .ln-card, .sc-table, .tk-card, .gl-fig, .access-grid');
    targets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity .9s cubic-bezier(.2,.8,.2,1), transform .9s cubic-bezier(.2,.8,.2,1)';
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => { e.target.style.opacity = '1'; e.target.style.transform = ''; }, i * 35);
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
        if (t) { ev.preventDefault(); t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }
      }
    });
  });
})();
