(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduced) {
    const targets = document.querySelectorAll('.menu-block, .sake-grid li, .access-poster, .hero-h');
    targets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0) rotate(var(--rot, 0deg))';
          }, i * 60);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18 });
    targets.forEach(el => io.observe(el));
  }
})();
