/* ============================================
   MIDNIGHT EDITORIAL — John Deere × Run With Instinct
   Main JavaScript — Animations, Interactions, Frame Sequence
   ============================================ */

(function () {
  'use strict';

  // — DOM Elements —
  const preloader = document.querySelector('.preloader');
  const preloaderBar = document.querySelector('.preloader__bar');
  const cursor = document.querySelector('.cursor');
  const heroCanvas = document.getElementById('heroCanvas');
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  // — Config —
  const TOTAL_FRAMES = 237;
  const FRAME_PATH = 'assets/frames/ezgif-frame-';

  // ============================================
  // FRAME SEQUENCE HERO ANIMATION
  // ============================================

  const frameImages = [];
  let currentFrame = 0;
  let loadedCount = 0;
  let heroCtx = null;
  let heroAnimationStarted = false;

  function padNumber(num, size) {
    let s = num.toString();
    while (s.length < size) s = '0' + s;
    return s;
  }

  function getFramePath(index) {
    return FRAME_PATH + padNumber(index, 3) + '.jpg';
  }

  function initHeroCanvas() {
    if (!heroCanvas) return;
    heroCtx = heroCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!heroCanvas) return;
    const container = heroCanvas.parentElement;
    heroCanvas.width = container.clientWidth;
    heroCanvas.height = container.clientHeight;
    drawFrame(currentFrame);
  }

  function preloadFrames() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        const progress = (loadedCount / TOTAL_FRAMES) * 100;
        if (preloaderBar) {
          preloaderBar.style.width = progress + '%';
        }
        if (loadedCount === TOTAL_FRAMES) {
          onAllFramesLoaded();
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          onAllFramesLoaded();
        }
      };
      frameImages[i - 1] = img;
    }
  }

  function drawFrame(index) {
    if (!heroCtx || !frameImages[index]) return;
    const img = frameImages[index];
    const canvas = heroCanvas;

    // Cover-fit the image
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    heroCtx.clearRect(0, 0, canvas.width, canvas.height);
    heroCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  function onAllFramesLoaded() {
    // Hide preloader
    setTimeout(() => {
      if (preloader) preloader.classList.add('hidden');
      startHeroAnimation();
      initRevealAnimations();
    }, 400);
  }

  function startHeroAnimation() {
    if (heroAnimationStarted) return;
    heroAnimationStarted = true;

    // Auto-play frames initially then switch to scroll-driven
    let autoFrame = 0;
    const autoPlaySpeed = 42; // ~24fps
    const autoPlayEnd = Math.min(60, TOTAL_FRAMES - 1); // Play first 60 frames

    const autoPlay = setInterval(() => {
      autoFrame++;
      if (autoFrame >= autoPlayEnd) {
        clearInterval(autoPlay);
        initScrollDrivenFrames();
        return;
      }
      currentFrame = autoFrame;
      drawFrame(currentFrame);
    }, autoPlaySpeed);

    drawFrame(0);
  }

  function initScrollDrivenFrames() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / docHeight;
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(scrollFraction * TOTAL_FRAMES)
      );

      if (frameIndex !== currentFrame) {
        currentFrame = frameIndex;
        requestAnimationFrame(() => drawFrame(currentFrame));
      }
    });
  }

  // ============================================
  // PRELOADER FALLBACK
  // ============================================

  // If frames take too long, dismiss preloader after 5s
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      startHeroAnimation();
      initRevealAnimations();
    }
  }, 5000);

  // ============================================
  // REVEAL ANIMATIONS (Intersection Observer)
  // ============================================

  function initRevealAnimations() {
    const revealEls = document.querySelectorAll('.reveal-up');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  }

  // ============================================
  // PARALLAX IMAGES
  // ============================================

  function initParallax() {
    const parallaxImages = document.querySelectorAll('.parallax-image__img');

    window.addEventListener('scroll', () => {
      parallaxImages.forEach(img => {
        const rect = img.parentElement.getBoundingClientRect();
        const scrollPercent = (rect.top + rect.height) / (window.innerHeight + rect.height);
        const translateY = (scrollPercent - 0.5) * -60;
        img.style.transform = `translateY(${translateY}px)`;
      });
    });
  }

  // ============================================
  // CUSTOM CURSOR
  // ============================================

  function initCursor() {
    if (!cursor) return;
    if (window.innerWidth < 768) return;

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    const hoverTargets = document.querySelectorAll('a, button, .gallery__item, .nav__cta');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      target.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  // ============================================
  // MOBILE NAV TOGGLE
  // ============================================

  function initMobileNav() {
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ============================================
  // COUNTER ANIMATION
  // ============================================

  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = el.getAttribute('data-count');
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const isDecimal = target.includes('.');
          const targetNum = parseFloat(target);
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // ease-out-quart
            const current = eased * targetNum;

            if (isDecimal) {
              el.textContent = prefix + current.toFixed(1) + suffix;
            } else {
              el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  // ============================================
  // MARQUEE DUPLICATION
  // ============================================

  function initMarquee() {
    const tracks = document.querySelectorAll('.marquee__track');
    tracks.forEach(track => {
      const items = track.innerHTML;
      track.innerHTML = items + items;
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    initHeroCanvas();
    preloadFrames();
    initCursor();
    initMobileNav();
    initSmoothScroll();
    initParallax();
    animateCounters();
    initMarquee();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
