import { useEffect } from 'react';

// Fades sections up as they scroll into view. It tags the direct children of each
// section's container (or of a grid inside it, so cards stagger) with .reveal, then
// removes the class again once the animation is done so hover styles are untouched.
// Anything inside [data-no-reveal] (e.g. the home hero) is left alone.
const SELECTOR = 'main section .container-custom, main section.container-custom';

export const useScrollReveal = (pathname) => {
  useEffect(() => {
    const main = document.getElementById('main-content');
    if (!main || typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          io.unobserve(el);
          el.classList.add('is-visible');
          setTimeout(() => el.classList.remove('reveal', 'is-visible'), 1200);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );

    const tag = (el, index) => {
      if (el.dataset.rv || el.closest('[data-no-reveal]')) return;
      el.dataset.rv = '1';
      el.style.setProperty('--reveal-delay', `${Math.min(index, 8) * 70}ms`);
      el.classList.add('reveal');
      io.observe(el);
    };

    const scan = () => {
      main.querySelectorAll(SELECTOR).forEach((container) => {
        Array.from(container.children).forEach((child) => {
          const isGrid = child.classList.contains('grid') && child.children.length > 1;
          if (isGrid) Array.from(child.children).forEach((c, i) => tag(c, i));
          else tag(child, 0);
        });
      });
    };

    scan();
    // content that arrives later (news, API data) gets the same treatment
    let timer;
    const mo = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(scan, 80);
    });
    mo.observe(main, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);
};
