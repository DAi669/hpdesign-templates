// MATTARI Fujisawa - Pattern A: California Open Air
// vanilla JS, defer loaded. prefers-reduced-motion respected.

(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------
  // 1. Header shrink on scroll
  // --------------------------
  const header = document.getElementById('siteHeader');
  let scrollY = 0;
  let ticking = false;

  function onScroll() {
    scrollY = window.scrollY || window.pageYOffset;
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', scrollY > 24);
        applyParallax();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // --------------------------
  // 2. Hero parallax (lightweight)
  // --------------------------
  const heroBg = document.querySelector('.hero-bg');
  function applyParallax() {
    if (!heroBg || reduced) return;
    const offset = Math.min(scrollY * 0.25, 200);
    heroBg.style.transform = `translateY(${offset}px)`;
  }

  // --------------------------
  // 3. Section fade-up via IntersectionObserver
  // --------------------------
  const fadeTargets = document.querySelectorAll('.story, .signature, .menu, .access, .news, .cta-final');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), idx * 60);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    fadeTargets.forEach(el => io.observe(el));
  } else {
    fadeTargets.forEach(el => el.classList.add('is-visible'));
  }

  // --------------------------
  // 4. Hero stat count-up
  // --------------------------
  const stats = document.querySelectorAll('.stat-num[data-count-to]');
  function countUp(el) {
    const target = parseInt(el.dataset.countTo, 10);
    if (reduced) { el.textContent = target.toLocaleString(); return; }
    const dur = 1400;
    const start = performance.now();
    const initial = parseInt(el.textContent.replace(/,/g, ''), 10) || 0;
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(initial + (target - initial) * eased);
      el.textContent = value.toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    const sIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { countUp(entry.target); sIo.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    stats.forEach(el => sIo.observe(el));
  } else {
    stats.forEach(countUp);
  }

  // --------------------------
  // 5. Menu tab switcher
  // --------------------------
  const tabBtns = document.querySelectorAll('.menu-tab');
  const tabPanels = document.querySelectorAll('.menu-grid');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('aria-controls');
      tabBtns.forEach(b => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      tabPanels.forEach(p => {
        const active = p.id === targetId;
        p.classList.toggle('active', active);
        if (active) { p.removeAttribute('hidden'); } else { p.setAttribute('hidden', ''); }
      });
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const list = Array.from(tabBtns);
        const i = list.indexOf(btn);
        const next = e.key === 'ArrowRight' ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
        list[next].focus();
        list[next].click();
      }
    });
  });

  // --------------------------
  // 6. Mobile nav toggle
  // --------------------------
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('primaryNavList');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const open = navList.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navList.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navList.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------
  // 7. Scroll progress bar
  // --------------------------
  const progressBar = document.getElementById('scrollProgressBar');
  function updateProgress() {
    if (!progressBar) return;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docH > 0 ? (scrollY / docH) : 0;
    progressBar.style.width = (ratio * 100).toFixed(2) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // --------------------------
  // 8. Cursor follower (hover-capable devices only)
  // --------------------------
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const follower = document.getElementById('cursorFollower');
  if (supportsHover && follower && !reduced) {
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      follower.classList.add('is-active');
    });
    document.addEventListener('mouseleave', () => {
      follower.classList.remove('is-active');
    });
    function tick() {
      curX += (mouseX - curX) * 0.16;
      curY += (mouseY - curY) * 0.16;
      follower.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    tick();

    // Enlarge on interactive element hover
    const hoverables = document.querySelectorAll('a, button, .menu-card, .story-pillar, .news-card');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => follower.classList.remove('is-hovering'));
    });
  }

  // --------------------------
  // 9. Menu card 3D tilt on mousemove (subtle)
  // --------------------------
  if (supportsHover && !reduced) {
    document.querySelectorAll('.menu-card').forEach(card => {
      let rect = null;
      card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect(); });
      card.addEventListener('mousemove', (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotY = x * 8;  // -4deg ~ +4deg
        const rotX = -y * 8;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        rect = null;
      });
    });
  }

  // --------------------------
  // 10. Story pillar stagger reveal
  // --------------------------
  const storyPillars = document.querySelectorAll('.story-pillar');
  if ('IntersectionObserver' in window && !reduced) {
    const pIo = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          const pillar = entry.target;
          const delay = parseInt(pillar.dataset.staggerIdx || '0', 10) * 140;
          setTimeout(() => {
            pillar.style.transition = 'opacity 0.7s var(--ease, ease), transform 0.7s var(--ease, ease)';
            pillar.style.opacity = '1';
            pillar.style.transform = 'translateY(0)';
          }, delay);
          pIo.unobserve(pillar);
        }
      });
    }, { threshold: 0.2 });
    storyPillars.forEach((p, idx) => {
      p.dataset.staggerIdx = idx;
      p.style.opacity = '0';
      p.style.transform = 'translateY(40px)';
      pIo.observe(p);
    });
  }
})();
