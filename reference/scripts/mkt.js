/* ECL — Flow 1 Marketing · router, nav, modal, accordion, scroll */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const views = { home: 'view-home', pricing: 'view-pricing', security: 'view-security', '404': 'view-404', signin: 'view-signin' };
  const nav = $('#mktNav');

  /* ---- VIEW ROUTER ---- */
  function show(name, scrollTarget) {
    if (!views[name]) name = '404';
    $$('.view').forEach(v => v.classList.remove('active'));
    const el = $('#' + views[name]);
    if (el) el.classList.add('active');
    if (history.replaceState) history.replaceState(null, '', '#/' + name);
    closeMenu();
    // nav state: only the landing hero is dark
    updateNav(name === 'home' ? window.scrollY : 999);
    if (scrollTarget) {
      requestAnimationFrame(() => {
        const t = $('#' + scrollTarget);
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    onScroll();
  }
  function currentView() {
    const a = $('.view.active');
    return a ? Object.keys(views).find(k => views[k] === a.id) : 'home';
  }

  document.addEventListener('click', e => {
    const go = e.target.closest('[data-go]');
    if (go) { e.preventDefault(); show(go.dataset.go, go.dataset.scroll); return; }
    if (e.target.closest('[data-demo]')) { e.preventDefault(); openModal(); return; }
  });

  /* ---- NAV SCROLL ---- */
  function updateNav(y) {
    const onHome = currentView() === 'home';
    if (onHome && y < 70) { nav.classList.add('over-hero'); nav.classList.remove('filled'); }
    else { nav.classList.remove('over-hero'); nav.classList.add('filled'); }
  }
  function onScroll() {
    const y = window.scrollY;
    updateNav(y);
    // scroll progress
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    $('#scrollprog').style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    // security TOC
    if (currentView() === 'security') updateToc();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- MOBILE MENU ---- */
  const burger = $('#burger'), menu = $('#mobileMenu');
  function closeMenu() { menu.classList.remove('open'); }
  burger && burger.addEventListener('click', () => menu.classList.toggle('open'));

  /* ---- ACCORDION ---- */
  $$('#faq .acc-q').forEach(q => q.addEventListener('click', () => {
    const item = q.closest('.acc-item');
    const open = item.classList.contains('open');
    $$('#faq .acc-item').forEach(i => { i.classList.remove('open'); i.querySelector('.acc-a').style.maxHeight = null; });
    if (!open) { item.classList.add('open'); const a = item.querySelector('.acc-a'); a.style.maxHeight = a.scrollHeight + 'px'; }
  }));
  // open the first by default
  const firstOpen = $('#faq .acc-item.open .acc-a');
  if (firstOpen) requestAnimationFrame(() => firstOpen.style.maxHeight = firstOpen.scrollHeight + 'px');

  /* ---- SECURITY TOC ---- */
  const tocLinks = $$('#toc a');
  tocLinks.forEach(a => a.addEventListener('click', () => {
    const t = $('#' + a.dataset.toc); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  function updateToc() {
    let active = null;
    $$('.sec-doc h2').forEach(h => { if (h.getBoundingClientRect().top < 140) active = h.id; });
    tocLinks.forEach(a => a.classList.toggle('active', a.dataset.toc === active));
  }

  /* ---- DEMO MODAL ---- */
  const scrim = $('#demoScrim'), modal = $('#demoModal');
  let lastFocus = null;
  function openModal() {
    lastFocus = document.activeElement;
    $('#demoForm').style.display = ''; $('#demoSuccess').style.display = 'none';
    scrim.classList.add('open'); document.body.style.overflow = 'hidden';
    setTimeout(() => { const f = $('#d-name'); f && f.focus(); }, 60);
  }
  function closeModal() { scrim.classList.remove('open'); document.body.style.overflow = ''; lastFocus && lastFocus.focus(); }
  document.addEventListener('click', e => { if (e.target.closest('[data-close]') || e.target === scrim) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && scrim.classList.contains('open')) closeModal();
    if (e.key === 'Tab' && scrim.classList.contains('open')) {
      const f = $$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])', modal).filter(el => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  $('#demoFields').addEventListener('submit', e => {
    e.preventDefault();
    $('#demoForm').style.display = 'none'; $('#demoSuccess').style.display = '';
  });

  /* ---- INIT FROM HASH ---- */
  const initial = (location.hash.match(/#\/(\w+)/) || [])[1] || 'home';
  show(views[initial] ? initial : 'home');
})();
