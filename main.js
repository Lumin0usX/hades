/* ============================================================
   HADES — Lord of the Underworld
   main.js
   ------------------------------------------------------------
   Responsibilities:
     1. Splash sequence (intro + ember particles + dismiss)
     2. Scroll-triggered reveals via IntersectionObserver
     3. Scrollspy: highlight current section in side nav
     4. Smooth in-page navigation w/ focus restoration
   All behaviour respects prefers-reduced-motion.
   ============================================================ */

(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ============================================================
     1 · SPLASH SEQUENCE
     ============================================================ */
  const splash  = document.getElementById('splash');
  const credit1 = document.getElementById('credit-1');
  const credit2 = document.getElementById('credit-2');
  const canvas  = document.getElementById('embers');

  function revealSite() {
    document.body.classList.add('site-revealed');
  }

  function dismissSplash(immediate = false) {
    if (!splash || splash.dataset.dismissed) return;
    splash.dataset.dismissed = '1';

    if (immediate) {
      splash.remove();
      revealSite();
      return;
    }

    splash.classList.add('dismissing');
    revealSite();
    setTimeout(() => splash.remove(), 1200);
  }

  // Reduced motion: skip the entire intro.
  if (reducedMotion) {
    dismissSplash(true);
  } else if (splash) {
    // Timing: 0.4s pause → credit1 (4s) → 0.4s gap → credit2 (4s) → dismiss (1.1s fade)
    const T_START_1 = 400;
    const T_START_2 = T_START_1 + 4000 + 400;   // 4800
    const T_DISMISS = T_START_2 + 4000;          // 8800

    const timers = [];
    const sched = (ms, fn) => timers.push(setTimeout(fn, ms));

    const onDismiss = () => {
      timers.forEach(clearTimeout);
      dismissSplash(false);
    };

    sched(T_START_1, () => credit1 && credit1.classList.add('show'));
    sched(T_START_2, () => credit2 && credit2.classList.add('show'));
    sched(T_DISMISS, () => dismissSplash(false));

    // Skip controls
    splash.addEventListener('click', onDismiss);
    splash.addEventListener('touchstart', onDismiss, { passive: true });
    window.addEventListener('keydown', onDismiss);

    // ------- Ember particle system -------
    if (canvas) initEmbers(canvas);
  }

  function initEmbers(canvas) {
    const ctx = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function spawn(initial) {
      return {
        x: Math.random() * W,
        y: initial ? Math.random() * H : H + 20 + Math.random() * 80,
        r: 0.5 + Math.random() * 1.4,
        vy: 0.10 + Math.random() * 0.45,
        vx: (Math.random() - 0.5) * 0.10,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.006 + Math.random() * 0.012,
        sway: 0.20 + Math.random() * 0.55,
        life: initial ? Math.random() * 900 : 0,
        maxLife: 700 + Math.random() * 900,
        hue: 16 + Math.random() * 14,
        brightness: 0.35 + Math.random() * 0.45,
      };
    }

    const COUNT = 28;
    let particles = Array.from({ length: COUNT }, () => spawn(true));

    let lastTime = performance.now();
    function frame(now) {
      if (!splash.isConnected) return;

      const dt = Math.min(50, now - lastTime);
      lastTime = now;
      const step = dt / 16.6667;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += dt;
        p.phase += p.phaseSpeed * dt;
        p.y -= p.vy * step;
        p.x += (p.vx + Math.sin(p.phase) * p.sway * 0.12) * step;

        const lf = p.life / p.maxLife;
        let alpha;
        if (lf < 0.18)      alpha = lf / 0.18;
        else if (lf > 0.70) alpha = Math.max(0, 1 - (lf - 0.70) / 0.30);
        else                alpha = 1;
        alpha *= p.brightness;

        const haloR = p.r * 9;
        const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
        halo.addColorStop(0,    `hsla(${p.hue}, 80%, 58%, ${alpha * 0.55})`);
        halo.addColorStop(0.35, `hsla(${p.hue}, 85%, 48%, ${alpha * 0.18})`);
        halo.addColorStop(1,    `hsla(${p.hue}, 85%, 40%, 0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `hsla(${p.hue + 8}, 92%, 78%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife || p.y < -30) {
          particles[i] = spawn(false);
        }
      }

      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }


  /* ============================================================
     2 · SCROLL REVEALS
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    // Show everything immediately
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealIO = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealIO.unobserve(entry.target);
        }
      }
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px',
    });

    revealEls.forEach((el) => revealIO.observe(el));
  }


  /* ============================================================
     3 · SCROLLSPY — highlight current section in side nav
     ============================================================ */
  const navLinks = document.querySelectorAll('#sidenav a[href^="#"]');
  const sectionMap = new Map();

  navLinks.forEach((link) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) sectionMap.set(target, link);
  });

  if ('IntersectionObserver' in window && sectionMap.size > 0) {
    const spyIO = new IntersectionObserver((entries) => {
      // Choose the entry closest to top among intersecting sections
      const intersecting = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (intersecting.length > 0) {
        const activeLink = sectionMap.get(intersecting[0].target);
        if (activeLink) {
          navLinks.forEach((l) => l.classList.toggle('is-active', l === activeLink));
        }
      }
    }, {
      // Trigger when section's top crosses the upper 40% of viewport
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    });

    sectionMap.forEach((_link, section) => spyIO.observe(section));
  }


  /* ============================================================
     4 · IMAGE FALLBACK — show curatorial label if a plate image fails
     ============================================================ */
  document.querySelectorAll('.plate__img, .hero__art-img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) {
      // already errored before listener attached
      const wrapper = img.closest('.plate') || img.closest('.hero__art');
      if (wrapper) wrapper.classList.add('plate--img-failed');
      return;
    }
    img.addEventListener('error', () => {
      const wrapper = img.closest('.plate') || img.closest('.hero__art');
      if (wrapper) wrapper.classList.add('plate--img-failed');
    }, { once: true });
  });


  /* ============================================================
     5 · SMOOTH NAV (focus restoration; CSS does the scroll)
     ============================================================ */
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      // Move focus for accessibility without re-scrolling
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      // Update URL hash without jump
      if (history.replaceState) history.replaceState(null, '', href);
    });
  });

})();
