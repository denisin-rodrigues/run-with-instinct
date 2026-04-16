/* ============================================
   JOHN DEERE — Midnight Editorial
   Main JavaScript — Infinite Loop Animation & Interactivity
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
  // FRAME SEQUENCE INFINITE LOOP
  // ============================================

  const frameImages = [];
  let currentFrame = 0;
  let loadedCount = 0;
  let heroCtx = null;
  let animationFrameId = null;
  let lastTime = 0;
  const fps = 24;
  const interval = 1000 / fps;

  function padNumber(num, size) {
    let s = num.toString();
    while (s.length < size) s = '0' + s;
    return s;
  }

  function getFramePath(index) {
    // Frames are 001 to 237
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
    // For background style, we want to cover the viewport or container
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
        console.error(`Error loading frame ${i}`);
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

    // Cover-fit logic
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
    setTimeout(() => {
      if (preloader) preloader.classList.add('hidden');
      startInfiniteLoop();
      initRevealAnimations();
      initParallax();
      animateCounters();
      initMarquee();
    }, 500);
  }

  function startInfiniteLoop() {
    function animate(time) {
      animationFrameId = requestAnimationFrame(animate);

      const delta = time - lastTime;
      if (delta > interval) {
        lastTime = time - (delta % interval);
        
        drawFrame(currentFrame);
        currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
      }
    }
    requestAnimationFrame(animate);
  }

  // Fallback preloader dismissal
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      startInfiniteLoop();
    }
  }, 10000);

  // ============================================
  // OTHER TYPICAL BEHAVIORS
  // ============================================

  function initRevealAnimations() {
    const revealEls = document.querySelectorAll('.reveal-up');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

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

  function initCursor() {
    if (!cursor || window.innerWidth < 768) return;
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    const targets = document.querySelectorAll('a, button, .gallery__item');
    targets.forEach(t => {
      t.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      t.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  function initMobileNav() {
    if (!navToggle || !navLinks) return;
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(l => {
      l.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseFloat(el.getAttribute('data-count'));
          const duration = 2000;
          const start = performance.now();
          function upd(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = eased * targetNum;
            el.textContent = (el.getAttribute('data-prefix') || '') + 
                             Math.floor(current).toLocaleString() + 
                             (el.getAttribute('data-suffix') || '');
            if (progress < 1) requestAnimationFrame(upd);
          }
          requestAnimationFrame(upd);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  }

  function initMarquee() {
    document.querySelectorAll('.marquee__track').forEach(t => {
      const content = t.innerHTML;
      t.innerHTML = content + content;
    });
  }

  // Initialization
  function init() {
    initHeroCanvas();
    preloadFrames();
    initCursor();
    initMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
