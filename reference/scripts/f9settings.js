/* ECL — Flow 9 Account & Settings · sections, password, theme, sessions */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const app = $('#app');

  /* ---- THEME (light/dark/system) ---- */
  let themePref = 'light';
  function applyTheme() {
    let t = themePref;
    if (themePref === 'system') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.setAttribute('data-theme', t);
    $$('[data-theme-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.themeBtn === t));
    $$('.theme-opt').forEach(o => o.classList.toggle('active', o.dataset.setTheme === themePref));
  }
  function setThemePref(p) { themePref = p; try { localStorage.setItem('ecl-theme-pref', p); } catch (e) {} applyTheme(); }
  $$('[data-theme-btn]').forEach(b => b.addEventListener('click', () => setThemePref(b.dataset.themeBtn)));
  $$('[data-set-theme]').forEach(o => o.addEventListener('click', () => { setThemePref(o.dataset.setTheme); toast('Theme set to ' + o.dataset.setTheme + '.'); }));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (themePref === 'system') applyTheme(); });
  try { const p = localStorage.getItem('ecl-theme-pref') || localStorage.getItem('ecl-theme'); if (p === 'light' || p === 'dark' || p === 'system') themePref = p; } catch (e) {}
  applyTheme();

  /* ---- DENSITY ---- */
  $$('#densitySeg button').forEach(b => b.addEventListener('click', () => {
    root.setAttribute('data-density', b.dataset.density);
    $$('#densitySeg button').forEach(x => x.setAttribute('aria-pressed', x === b));
    try { localStorage.setItem('ecl-density', b.dataset.density); } catch (e) {}
  }));
  try { const d = localStorage.getItem('ecl-density'); if (d) { root.setAttribute('data-density', d); $$('#densitySeg button').forEach(x => x.setAttribute('aria-pressed', x.dataset.density === d)); } } catch (e) {}

  /* ---- SHELL ---- */
  $('#collapseBtn').addEventListener('click', () => { app.dataset.side = app.dataset.side === 'collapsed' ? 'expanded' : 'collapsed'; });
  $('#menuBtn').addEventListener('click', () => { app.dataset.side = 'open'; $('#sideScrim').classList.add('open'); });
  $('#sideScrim').addEventListener('click', () => { app.dataset.side = 'expanded'; $('#sideScrim').classList.remove('open'); });

  /* ---- SECTION NAV ---- */
  function gotoSec(sec) {
    $$('#setNav a').forEach(x => x.classList.toggle('active', x.dataset.sec === sec));
    $$('.set-sec').forEach(s => s.classList.toggle('active', s.id === 'sec-' + sec));
    $$('[data-jump]').forEach(b => b.setAttribute('aria-pressed', b.dataset.jump === sec));
    window.scrollTo({ top: 0 });
  }
  $$('#setNav a').forEach(a => a.addEventListener('click', () => gotoSec(a.dataset.sec)));
  $$('[data-jump]').forEach(b => b.addEventListener('click', () => gotoSec(b.dataset.jump)));

  /* ---- TOAST ---- */
  function toast(msg, kind) {
    const ic = kind === 'danger' ? 'i-alert' : kind === 'info' ? 'i-info' : 'i-check';
    const col = kind === 'danger' ? 'var(--danger)' : kind === 'info' ? 'var(--accent)' : 'var(--success)';
    const el = document.createElement('div'); el.className = 'toast';
    el.innerHTML = `<svg class="ic" style="color:${col}"><use href="#${ic}"/></svg><span class="grow">${msg}</span><button class="btn btn-icon btn-sm" aria-label="Dismiss"><svg class="ic ic-14"><use href="#i-x"/></svg></button>`;
    $('#toastStack').appendChild(el);
    el.querySelector('button').addEventListener('click', () => el.remove());
    setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3000);
  }

  /* ---- MODAL ---- */
  const scrim = $('#modalScrim'), card = $('#modalCard');
  function modal(html) { card.innerHTML = html; scrim.style.display = 'flex'; $$('[data-mclose]', card).forEach(b => b.addEventListener('click', () => scrim.style.display = 'none')); }
  scrim.addEventListener('click', e => { if (e.target === scrim) scrim.style.display = 'none'; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') scrim.style.display = 'none'; });

  /* ---- SAVE BAR (profile dirty) ---- */
  let dirty = false;
  function markDirty() {
    if (dirty) return; dirty = true;
    $('#saveBarSlot').innerHTML = `<div style="position:fixed;left:0;right:0;bottom:0;z-index:70;padding:0 var(--gutter) 16px;display:flex;justify-content:center;pointer-events:none"><div class="save-bar" style="pointer-events:auto;max-width:760px;width:100%"><span class="sb-msg"><svg class="ic ic-14" style="color:var(--warning)"><use href="#i-info"/></svg>You have unsaved profile changes.</span><div class="row-tight"><button class="btn btn-ghost" id="sbCancel">Discard</button><button class="btn btn-primary" id="sbSave"><svg class="ic ic-14"><use href="#i-check"/></svg>Save changes</button></div></div></div>`;
    $('#sbSave').addEventListener('click', () => { clearDirty(); updateAvatar(); toast('Profile saved.'); });
    $('#sbCancel').addEventListener('click', () => { clearDirty(); toast('Changes discarded.', 'info'); });
  }
  function clearDirty() { dirty = false; $('#saveBarSlot').innerHTML = ''; }
  ['a-name', 'a-title'].forEach(id => $('#' + id).addEventListener('input', markDirty));
  function updateAvatar() {
    const name = $('#a-name').value.trim();
    const init = name.split(/\s+/).map(p => p[0]).join('').slice(0, 2).toUpperCase() || 'U';
    $('#avatarBig').textContent = init;
  }
  $('#uploadAvatar').addEventListener('click', () => toast('Photo upload is a stub in this prototype.', 'info'));

  /* ---- PASSWORD + STRENGTH ---- */
  $$('[data-toggle-pass]').forEach(btn => btn.addEventListener('click', () => {
    const inp = $('#' + btn.dataset.togglePass); const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    btn.innerHTML = `<svg class="ic"><use href="#i-${show ? 'eye-off' : 'eye'}"/></svg>`;
  }));
  const forbidden = ['mwangi', 'tendai', 'savanna'];
  function score(pw) {
    let s = 0;
    if (pw.length >= 8) s++; if (pw.length >= 12) s++;
    if (/[a-zA-Z]/.test(pw) && /\d/.test(pw)) s++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    if (forbidden.some(f => pw.toLowerCase().includes(f))) s = Math.min(s, 1);
    return Math.min(s, 5);
  }
  function validatePw() {
    const cur = $('#pw-cur').value, np = $('#pw-new').value, cf = $('#pw-conf').value;
    const s = np ? score(np) : 0;
    const meter = $('#pwStrength'), lab = $('#pwStrengthLabel');
    meter.className = 'strength' + (np ? ' s' + Math.max(s, 1) : '');
    if (!np) { lab.textContent = '\u00A0'; lab.className = 'strength-label'; }
    else if (s <= 2) { lab.textContent = 'Weak'; lab.className = 'strength-label weak'; }
    else if (s === 3) { lab.textContent = 'Fair'; lab.className = 'strength-label fair'; }
    else { lab.textContent = 'Strong'; lab.className = 'strength-label strong'; }
    const match = np.length > 0 && np === cf;
    $('#pwMismatch').style.display = (cf.length > 0 && !match) ? 'flex' : 'none';
    $('#pw-conf').classList.toggle('is-error', cf.length > 0 && !match);
    $('#pwBtn').disabled = !(cur.length > 0 && s >= 3 && match);
  }
  ['pw-cur', 'pw-new', 'pw-conf'].forEach(id => $('#' + id).addEventListener('input', validatePw));
  $('#pwForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = $('#pwBtn'); btn.innerHTML = '<span class="spinner"></span>Updating…'; btn.disabled = true;
    setTimeout(() => {
      $('#pwForm').reset(); validatePw(); btn.innerHTML = 'Update password';
      $('.set-card-head p').textContent = 'Last changed just now. Use a strong password you don\'t reuse.';
      toast('Password updated.');
    }, 1000);
  });

  /* ---- NOTIFICATIONS (toast on change) ---- */
  $$('.notif-item-row .switch input').forEach(sw => sw.addEventListener('change', () => toast('Notification preference saved.', 'info')));

  /* ---- SESSIONS ---- */
  let sessions = [
    { ic: 'i-laptop', t: 'MacBook Pro · Chrome', d: 'Nairobi, Kenya · current session', current: true },
    { ic: 'i-laptop', t: 'Windows · Edge', d: 'Nairobi, Kenya · 2 hours ago', current: false },
    { ic: 'i-phone', t: 'iPhone · Safari', d: 'Mombasa, Kenya · yesterday', current: false }
  ];
  function renderSessions() {
    $('#sessionsBody').innerHTML = sessions.map((s, i) => `
      <div class="session-row ${s.current ? 'current' : ''}">
        <span class="se-ic"><svg class="ic ic-20"><use href="#${s.ic}"/></svg></span>
        <div class="se-meta"><div class="t">${s.t}${s.current ? ' <span class="pill pill-success" style="height:18px">This device</span>' : ''}</div><div class="d">${s.d}</div></div>
        ${s.current ? '' : `<button class="btn btn-ghost btn-sm" data-signout="${i}">Sign out</button>`}
      </div>`).join('');
    $$('[data-signout]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.signout; const name = sessions[i].t; sessions.splice(i, 1); renderSessions(); toast('Signed out of ' + name + '.', 'info'); }));
  }
  $('#signoutAll').addEventListener('click', () => {
    modal(`<div class="auth-icon warn" style="width:44px;height:44px;border-radius:12px;background:var(--warning-subtle);color:var(--warning);display:grid;place-items:center;margin-bottom:14px"><svg class="ic ic-20"><use href="#i-logout"/></svg></div><h3 class="t-h2" style="font-size:var(--fs-h2)">Sign out everywhere?</h3><p class="muted" style="margin-top:8px">All other devices will be signed out. This device stays active.</p><div class="row-tight" style="margin-top:20px;gap:10px"><button class="btn btn-secondary grow" data-mclose>Cancel</button><button class="btn btn-primary grow" id="doSignoutAll">Sign out others</button></div>`);
    $('#doSignoutAll').addEventListener('click', () => { sessions = sessions.filter(s => s.current); scrim.style.display = 'none'; renderSessions(); toast('Signed out of all other devices.', 'info'); });
  });

  /* ---- INIT ---- */
  renderSessions();
})();
