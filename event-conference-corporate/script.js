// Future Tech Summit 2026 - 開会までのカウントダウン
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      const d = target - new Date();
      if (d <= 0) {
        cells.days.textContent = '000'; cells.hours.textContent = '00';
        cells.minutes.textContent = '00'; cells.seconds.textContent = '00';
        return;
      }
      const s = Math.floor(d / 1000);
      cells.days.textContent = pad(Math.floor(s / 86400), 3);
      cells.hours.textContent = pad(Math.floor((s % 86400) / 3600), 2);
      cells.minutes.textContent = pad(Math.floor((s % 3600) / 60), 2);
      cells.seconds.textContent = pad(s % 60, 2);
    }
    tick();
    setInterval(tick, 1000);
  }

  // ===== KPI カウントアップ =====
  if ('IntersectionObserver' in window) {
    const kpis = document.querySelectorAll('.kpi-num');
    function countUp(el) {
      const target = parseInt(el.textContent.replace(/,/g, ''), 10);
      if (reduced || isNaN(target)) { el.textContent = target.toLocaleString(); return; }
      const dur = 1400; const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (t < 1) requestAnimationFrame(tick);
      }
      el.textContent = '0';
      requestAnimationFrame(tick);
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    kpis.forEach(el => io.observe(el));
  }

  // ===== スクロールリビール =====
  if ('IntersectionObserver' in window && !reduced) {
    const targets = document.querySelectorAll('.about-grid, .sp-card, .ag-day, .tk-card, .sp-tier, .access-grid');
    targets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity .9s cubic-bezier(.2,.8,.2,1), transform .9s cubic-bezier(.2,.8,.2,1)';
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => { e.target.style.opacity = '1'; e.target.style.transform = ''; }, i * 34);
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
