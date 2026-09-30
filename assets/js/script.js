document.addEventListener('DOMContentLoaded', () => {

  const header = document.getElementById('header');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =====================================================
     1. Mobile navigation menu
     ===================================================== */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navIcon = document.getElementById('nav-icon');
  const navLinks = document.querySelectorAll('#nav-menu a');

  const openMenu = () => {
    if (!navMenu) return;
    navMenu.classList.remove('-right-full');
    navMenu.classList.add('right-0');
    if (navIcon) navIcon.className = 'ri-close-line';
  };

  const closeMenu = () => {
    if (!navMenu) return;
    navMenu.classList.remove('right-0');
    navMenu.classList.add('-right-full');
    if (navIcon) navIcon.className = 'ri-menu-line';
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.contains('right-0') ? closeMenu() : openMenu();
    });
  }

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (!navMenu || !navMenu.classList.contains('right-0')) return;
    if (!navMenu.contains(e.target) && navToggle && !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  /* =====================================================
     2. Dark / light theme toggle (remembers the choice)
     ===================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const htmlEl = document.documentElement;

  const applyTheme = (theme) => {
    htmlEl.classList.remove('dark', 'light');
    htmlEl.classList.add(theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'ri-moon-line text-lg' : 'ri-sun-line text-lg';
    }
  };

  let savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem('theme') || 'dark';
  } catch (err) { /* storage blocked */ }
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const next = htmlEl.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (err) { /* ignore */ }
    });
  }

  /* =====================================================
     3. Sliders (Projects and Certificates) with autoplay
     ===================================================== */
  const initSlider = (wrapperId, swiperSelector) => {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper || typeof Swiper === 'undefined') return;

    new Swiper(wrapper.querySelector(swiperSelector), {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: reduceMotion ? false : {
        delay: 4500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: wrapper.querySelector('.swiper-pagination'),
        clickable: true,
      },
      navigation: {
        nextEl: wrapper.querySelector('.swiper-button-next'),
        prevEl: wrapper.querySelector('.swiper-button-prev'),
      },
    });
  };

  initSlider('projects-slider', '.projectsSwiper');
  initSlider('certificates-slider', '.certificatesSwiper');

  /* =====================================================
     4. Scroll reveal animations
     ===================================================== */
  const visibleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      visibleObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.animate-on-scroll').forEach((el) => visibleObserver.observe(el));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal-item'));
      const index = Math.max(siblings.indexOf(el), 0);
      el.style.animationDelay = `${index * 0.12}s`;

      el.classList.add('animate-fade-up');
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .reveal-item').forEach((el) => revealObserver.observe(el));

  /* =====================================================
     5. Scroll progress bar, navbar shadow, back-to-top
     ===================================================== */
  const progressBar = document.getElementById('scroll-progress');
  const backTop = document.getElementById('back-to-top');

  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const progress = max > 0 ? (doc.scrollTop / max) * 100 : 0;

    if (progressBar) progressBar.style.width = `${progress}%`;
    if (header) header.classList.toggle('scrolled', doc.scrollTop > 10);
    if (backTop) backTop.classList.toggle('show', doc.scrollTop > 600);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* =====================================================
     6. Active nav link (scroll spy)
     ===================================================== */
  const sections = document.querySelectorAll('main section[id]');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach((section) => spy.observe(section));

  /* =====================================================
     7. Typing effect in the hero
     ===================================================== */
  const typed = document.getElementById('typed');
  if (typed && !reduceMotion) {
    const words = ['Full Stack Developer', 'Machine Learning Enthusiast', 'Aspiring Researcher'];
    let w = 0;
    let c = words[0].length;
    let deleting = true;

    const tick = () => {
      const word = words[w];
      typed.textContent = word.slice(0, c);

      if (!deleting && c === word.length) {
        deleting = true;
        return setTimeout(tick, 1800);
      }
      if (deleting && c === 0) {
        deleting = false;
        w = (w + 1) % words.length;
      }
      c += deleting ? -1 : 1;
      setTimeout(tick, deleting ? 40 : 90);
    };

    setTimeout(tick, 2200);
  }

  /* =====================================================
     8. Card spotlight (glow follows the mouse)
     ===================================================== */
  const cards = document.querySelectorAll('main .bg-container-adaptive.rounded-2xl, main .bg-container-adaptive.rounded-3xl');
  cards.forEach((card) => card.classList.add('spot'));

  if (!reduceMotion) {
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest ? e.target.closest('.spot') : null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  }
});
