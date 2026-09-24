(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const typedText = document.getElementById('typed-text');
  const phrases = ['dat werkt', 'dat opvalt', 'dat verrast'];
  let phraseIndex = 0;
  let deleting = true;
  let typingTimer;

  function typeNext() {
    const phrase = phrases[phraseIndex];
    const length = typedText.textContent.length;
    typedText.textContent = phrase.slice(0, length + (deleting ? -1 : 1));
    let delay = deleting ? 65 : 110;
    if (deleting && !typedText.textContent.length) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    } else if (!deleting && typedText.textContent === phrase) {
      deleting = true;
      delay = 2400;
    }
    typingTimer = setTimeout(typeNext, delay);
  }

  function syncTyping() {
    clearTimeout(typingTimer);
    if (motion.matches) {
      phraseIndex = 0;
      deleting = true;
      typedText.textContent = phrases[0];
    } else if (!document.hidden) {
      typingTimer = setTimeout(typeNext, 2400);
    }
  }
  motion.addEventListener('change', syncTyping);
  document.addEventListener('visibilitychange', syncTyping);
  syncTyping();

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    toggle.setAttribute('aria-label', `${dark ? 'Licht' : 'Donker'} thema inschakelen`);
    toggle.title = dark ? 'Licht thema' : 'Donker thema';
    toggle.innerHTML = `<i class="bi bi-${dark ? 'sun' : 'moon'}" aria-hidden="true"></i>`;
  }
  try { applyTheme(localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark'); } catch { applyTheme('dark'); }
  toggle.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch { /* Theme still works without storage. */ }
  });
  let pointerFrame = 0;
  window.addEventListener('pointermove', event => {
    if (motion.matches || !pointer.matches || pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      root.style.setProperty('--mx', `${(event.clientX / innerWidth - .5) * 100}px`);
      root.style.setProperty('--my', `${(event.clientY / innerHeight - .5) * 80}px`);
      pointerFrame = 0;
    });
  }, { passive: true });
  const progress = document.querySelector('.reading-progress');
  const links = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.hash));
  let scrollFrame = 0;
  function updateScroll() {
    const distance = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? scrollY / distance : 0})`;
    let active = 0;
    sections.forEach((section, index) => { if (section && section.getBoundingClientRect().top <= 160) active = index; });
    links.forEach((link, index) => {
      link.classList.toggle('active', index === active);
      if (index === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
    scrollFrame = 0;
  }
  window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('pending');
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .08 });
    document.querySelectorAll('main .card, main .display-5').forEach(element => {
      element.classList.add('reveal', 'pending');
      observer.observe(element);
    });
    motion.addEventListener('change', () => {
      if (motion.matches) {
        observer.disconnect();
        document.querySelectorAll('.reveal.pending').forEach(element => element.classList.remove('pending'));
      }
    });
  }
  document.querySelectorAll('.project-image').forEach(image => { image.loading = 'lazy'; image.decoding = 'async'; });
  document.querySelectorAll('.navbar a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    const menu = document.getElementById('navbarNav');
    if (!window.bootstrap) return;
    const closeMenu = () => bootstrap.Collapse.getOrCreateInstance(menu).hide();
    if (menu.classList.contains('collapsing')) {
      menu.addEventListener('shown.bs.collapse', closeMenu, { once: true });
    } else if (menu.classList.contains('show')) closeMenu();
  }));
})();
