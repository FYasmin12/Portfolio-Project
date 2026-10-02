document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('#nav-menu a');
  const typed = document.getElementById('typed');

  const htmlEl = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  const applyTheme = (theme) => {
    htmlEl.classList.remove('dark', 'light');
    htmlEl.classList.add(theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'ri-moon-line text-lg' : 'ri-sun-line text-lg';
    }
  };

  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('theme') || 'dark'; } catch (e) {}
  applyTheme(savedTheme);

  themeBtn?.addEventListener('click', () => {
    const next = htmlEl.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      const siblings = [...target.parentElement.children].filter((c) => c.classList.contains('reveal-item'));
      target.style.animationDelay = `${Math.max(siblings.indexOf(target), 0) * 0.12}s`;
      target.classList.add('animate-fade-up');
      revealObserver.unobserve(target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .reveal-item').forEach((el) => revealObserver.observe(el));

  
  const progressBar = document.getElementById('scroll-progress');
  const backTop = document.getElementById('back-to-top');

  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    if (progressBar) progressBar.style.width = `${max > 0 ? (doc.scrollTop / max) * 100 : 0}%`;
    header?.classList.toggle('scrolled', doc.scrollTop > 10);
    backTop?.classList.toggle('show', doc.scrollTop > 600);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backTop?.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  );

  
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      navLinks.forEach((link) =>
        link.classList.toggle('active', link.getAttribute('href') === `#${target.id}`)
      );
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

 
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

 
  document
    .querySelectorAll('main .bg-container-adaptive.rounded-2xl, main .bg-container-adaptive.rounded-3xl')
    .forEach((card) => card.classList.add('spot'));

  if (!reduceMotion) {
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest?.('.spot');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  }
});