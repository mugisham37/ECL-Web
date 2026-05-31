/* ECL — Flow 2 Authentication · router, states, strength, transitions */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;

  /* ---- THEME ---- */
  function setTheme(t) { root.setAttribute('data-theme', t); $$('[data-theme-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.themeBtn === t)); try { localStorage.setItem('ecl-theme', t); } catch (e) {} }
  $$('[data-theme-btn]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeBtn)));
  try { const st = localStorage.getItem('ecl-theme'); if (st) setTheme(st); else if (matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark'); } catch (e) {}

  /* ---- SCREEN ROUTER ---- */
  const screens = { login: 's-login', forgot: 's-forgot', reset: 's-reset', invite: 's-invite', token: 's-token', twofa: 's-twofa' };
  function go(name) {
    if (!screens[name]) return;
    $$('.auth-screen').forEach(s => s.classList.remove('active'));
    $('#' + screens[name]).classList.add('active');
    $$('#screensMenu [data-go]').forEach(b => b.classList.toggle('on', b.dataset.go === name));
    menu.classList.remove('open');
    // re-trigger card entrance
    const card = $('#' + screens[name] + ' [data-card]');
    if (card) { card.style.animation = 'none'; void card.offsetWidth; card.style.animation = ''; }
    // focus first input
    setTimeout(() => { const f = $('#' + screens[name] + ' input:not([type=checkbox]):not([disabled])'); f && f.focus(); }, 80);
  }
  document.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); go(g.dataset.go); } });

  /* ---- SCREENS MENU ---- */
  const menu = $('#screensMenu'), screensBtn = $('#screensBtn');
  screensBtn.addEventListener('click', e => { e.stopPropagation(); menu.classList.toggle('open'); });
  document.addEventListener('click', e => { if (!e.target.closest('.proto')) menu.classList.remove('open'); });

  /* ---- SHOW / HIDE PASSWORD ---- */
  $$('[data-toggle-pass]').forEach(btn => btn.addEventListener('click', () => {
    const inp = $('#' + btn.dataset.togglePass);
    const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    btn.innerHTML = `<svg class="ic"><use href="#i-${show ? 'eye-off' : 'eye'}"/></svg>`;
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  }));

  /* ---- LOADING HELPER ---- */
  function setLoading(btn, on, label) {
    if (on) { btn.dataset.lbl = btn.textContent; btn.innerHTML = `<span class="spinner"></span>${label || 'Working…'}`; btn.disabled = true; }
    else { btn.textContent = btn.dataset.lbl || btn.textContent; btn.disabled = false; }
  }
  function cardSuccess(cardEl, iconCls, icon, title, sub, redirect) {
    cardEl.innerHTML = `<div class="auth-center"><div class="auth-icon ${iconCls}" style="margin:0 auto 18px"><svg class="ic ic-24"><use href="#i-${icon}"/></svg></div><h2>${title}</h2><p class="sub">${sub}</p>${redirect ? '<div class="row-tight" style="justify-content:center;margin-top:18px;color:var(--text-muted);font-size:var(--fs-caption)"><span class="spinner" style="width:14px;height:14px"></span>Taking you to your dashboard…</div>' : ''}</div>`;
  }

  /* ---- LOGIN ---- */
  const loginForm = $('#loginForm'), loginBtn = $('#loginBtn'), loginError = $('#loginError'), loginErrMsg = $('#loginErrorMsg');
  function shake() { const c = $('#s-login [data-card]'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); }
  function loginErr(msg) { loginError.style.display = 'flex'; loginErrMsg.textContent = msg; shake(); }
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    loginError.style.display = 'none';
    setLoading(loginBtn, true, 'Signing in…');
    $('#l-email').disabled = $('#l-pass').disabled = true;
    setTimeout(() => {
      cardSuccess($('#s-login [data-card]'), 'ok', 'check', 'Signed in', 'Welcome back, Tendai.', true);
    }, 1100);
  });

  /* ---- SIMULATE STATES ---- */
  document.addEventListener('click', e => {
    const sim = e.target.closest('[data-sim]'); if (!sim) return;
    menu.classList.remove('open');
    if (sim.dataset.sim === 'error') { go('login'); setTimeout(() => loginErr('Email or password incorrect.'), 120); }
    else if (sim.dataset.sim === 'rate') { go('login'); setTimeout(() => loginErr('Too many attempts. Try again in 5 minutes.'), 120); }
    else if (sim.dataset.sim === 'loading') {
      const active = $('.auth-screen.active'); const btn = active.querySelector('button[type="submit"]');
      if (btn) { setLoading(btn, true, 'Submitting…'); setTimeout(() => setLoading(btn, false), 2000); }
    }
  });

  /* ---- FORGOT ---- */
  const forgotFormEl = $('#forgotFormEl');
  forgotFormEl.addEventListener('submit', e => {
    e.preventDefault();
    const btn = $('#forgotBtn'); setLoading(btn, true, 'Sending…');
    setTimeout(() => {
      const email = $('#f-email').value.trim() || 'your inbox';
      $('#sentEmail').textContent = email;
      $('#forgotForm').style.display = 'none';
      $('#forgotSent').style.display = 'block';
      startCountdown();
    }, 900);
  });
  let cdTimer;
  function startCountdown() {
    let n = 60; const el = $('#resendCd'), btn = $('#resendBtn');
    btn.disabled = true; btn.style.opacity = '.5';
    clearInterval(cdTimer);
    cdTimer = setInterval(() => {
      n--; el.textContent = n + 's';
      if (n <= 0) { clearInterval(cdTimer); el.textContent = 'now'; btn.disabled = false; btn.style.opacity = '1'; }
    }, 1000);
  }
  $('#resendBtn').addEventListener('click', () => { if (!$('#resendBtn').disabled) startCountdown(); });

  /* ---- PASSWORD STRENGTH ---- */
  function score(pw, forbidden) {
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (/[a-zA-Z]/.test(pw) && /\d/.test(pw)) s++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    if (forbidden && pw && forbidden.some(f => f && f.length > 2 && pw.toLowerCase().includes(f.toLowerCase()))) s = Math.min(s, 1);
    return Math.min(s, 5);
  }
  function paintStrength(meterEl, labelEl, pw, forbidden) {
    const s = pw ? score(pw, forbidden) : 0;
    meterEl.className = 'strength' + (pw ? ' s' + Math.max(s, 1) : '');
    if (labelEl) {
      if (!pw) { labelEl.textContent = '\u00A0'; labelEl.className = 'strength-label'; }
      else if (s <= 2) { labelEl.textContent = 'Weak'; labelEl.className = 'strength-label weak'; }
      else if (s === 3) { labelEl.textContent = 'Fair'; labelEl.className = 'strength-label fair'; }
      else { labelEl.textContent = 'Strong'; labelEl.className = 'strength-label strong'; }
    }
    return s;
  }
  function setRules(pw, forbidden) {
    const r = {
      len8: pw.length >= 8,
      mix: /[a-zA-Z]/.test(pw) && /\d/.test(pw),
      name: pw.length > 0 && !(forbidden || []).some(f => f && f.length > 2 && pw.toLowerCase().includes(f.toLowerCase())),
      len12: pw.length >= 12
    };
    $$('#rRules .rule').forEach(el => el.classList.toggle('met', !!r[el.dataset.rule]));
    return r;
  }

  /* ---- RESET ---- */
  const rPass = $('#r-pass'), rConfirm = $('#r-confirm'), rBtn = $('#resetBtn'), rMismatch = $('#rMismatch');
  const resetForbidden = ['mwangi', 'tendai', 'savanna', 'savannabank'];
  function validateReset() {
    const pw = rPass.value, cf = rConfirm.value;
    const s = paintStrength($('#rStrength'), $('#rStrengthLabel'), pw, resetForbidden);
    const rules = setRules(pw, resetForbidden);
    const match = pw.length > 0 && pw === cf;
    rMismatch.style.display = (cf.length > 0 && !match) ? 'flex' : 'none';
    $('#r-confirm').classList.toggle('is-error', cf.length > 0 && !match);
    rBtn.disabled = !(rules.len8 && rules.mix && match && s >= 3);
  }
  rPass.addEventListener('input', validateReset);
  rConfirm.addEventListener('input', validateReset);
  $('#resetFormEl').addEventListener('submit', e => {
    e.preventDefault(); setLoading(rBtn, true, 'Updating…');
    setTimeout(() => { $('#resetForm').style.display = 'none'; $('#resetDone').style.display = 'block'; }, 900);
  });

  /* ---- INVITE ---- */
  const iName = $('#i-name'), iPass = $('#i-pass'), iConfirm = $('#i-confirm'), iTerms = $('#i-terms'), iBtn = $('#inviteBtn');
  function validateInvite() {
    const pw = iPass.value, cf = iConfirm.value, nm = iName.value.trim();
    const forbidden = [nm.split(/\s+/)[0], 'savanna'].filter(Boolean);
    const s = paintStrength($('#iStrength'), null, pw, forbidden);
    const match = pw.length > 0 && pw === cf;
    $('#i-confirm').classList.toggle('is-error', cf.length > 0 && !match);
    iBtn.disabled = !(nm.length > 1 && s >= 3 && match && iTerms.checked && pw.length >= 8);
  }
  [iName, iPass, iConfirm].forEach(el => el.addEventListener('input', validateInvite));
  iTerms.addEventListener('change', validateInvite);
  $('#inviteFormEl').addEventListener('submit', e => {
    e.preventDefault(); setLoading(iBtn, true, 'Joining…');
    setTimeout(() => cardSuccess($('#s-invite [data-card]'), 'ok', 'check', 'Welcome to Savanna Bank', 'Your account is ready.', true), 1100);
  });

  /* ---- INIT ---- */
  const initial = (location.hash.match(/#\/(\w+)/) || [])[1];
  go(screens[initial] ? initial : 'login');
})();
