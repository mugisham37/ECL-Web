/* ECL — Flow 5 New Run wizard · upload, validate, confirm, compute, terminal */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const app = $('#app');

  /* ---- THEME + SHELL ---- */
  function setTheme(t) { root.setAttribute('data-theme', t); $$('[data-theme-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.themeBtn === t)); try { localStorage.setItem('ecl-theme', t); } catch (e) {} }
  $$('[data-theme-btn]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeBtn)));
  try { const st = localStorage.getItem('ecl-theme'); if (st) setTheme(st); else if (matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark'); } catch (e) {}
  $('#collapseBtn').addEventListener('click', () => { app.dataset.side = app.dataset.side === 'collapsed' ? 'expanded' : 'collapsed'; });
  $('#menuBtn').addEventListener('click', () => { app.dataset.side = 'open'; $('#sideScrim').classList.add('open'); });
  $('#sideScrim').addEventListener('click', () => { app.dataset.side = 'expanded'; $('#sideScrim').classList.remove('open'); });

  /* ---- STEPS ---- */
  const STEPS = [{ k: 'upload', label: 'Upload' }, { k: 'validate', label: 'Validate' }, { k: 'confirm', label: 'Confirm' }, { k: 'compute', label: 'Compute' }];
  const SCREENS = { upload: 'rs-upload', validate: 'rs-validate', confirm: 'rs-confirm', compute: 'rs-compute', success: 'rs-success', failure: 'rs-failure' };
  let cur = 0;   // step index (0..3)
  let terminal = null; // 'success' | 'failure' | null

  // simulated file state
  const files = {
    PD: [{ name: 'PD_loans_2026-05.xlsx', size: '2.4 MB', sheets: 3, status: 'ok', hash: 'a3f9…2c1b' }],
    LGD: [{ name: 'LGD_collateral_05.xlsx', size: '1.1 MB', sheets: 1, status: 'ok', hash: 'c81a…77fe' }],
    EAD: [{ name: 'EAD_balances_05.xlsx', size: '3.7 MB', sheets: 2, status: 'ok', hash: 'e918…5b6d' }]
  };

  function renderSteps() {
    $('#runSteps').innerHTML = STEPS.map((s, i) => {
      let cls = i < cur ? 'done' : i === cur ? 'active' : '';
      if (terminal === 'failure' && i === 3) cls = 'error';
      const inner = (i < cur || (terminal === 'success' && i === 3)) ? '<svg class="ic"><use href="#i-check"/></svg>' : (terminal === 'failure' && i === 3 ? '<svg class="ic"><use href="#i-x"/></svg>' : (i + 1));
      return `<div class="rs ${cls}"><span class="n">${inner}</span><span class="lbl-txt">${s.label}</span></div>${i < STEPS.length - 1 ? '<span class="line"></span>' : ''}`;
    }).join('');
  }

  function showScreen(key) { $$('.run-screen').forEach(s => s.classList.remove('active')); $('#' + SCREENS[key]).classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  function goStep(i) {
    terminal = null;
    cur = Math.max(0, Math.min(3, i));
    renderSteps();
    showScreen(STEPS[cur].k);
    $('#runFoot').style.display = 'flex';
    $('#rfBack').style.visibility = cur === 0 ? 'hidden' : 'visible';
    if (cur === 0) { renderUploads(); setNext('Continue to validation', uploadReady()); }
    if (cur === 1) { runValidation(); }
    if (cur === 2) { renderConfirm(); setNext('Start computation', true, 'i-zap'); $('#rfNext').className = 'btn btn-primary'; }
    if (cur === 3) { startCompute(); $('#runFoot').style.display = 'none'; }
  }

  function setNext(label, enabled, icon) {
    const n = $('#rfNext'), tip = $('#rfTip');
    n.innerHTML = `${icon ? `<svg class="ic"><use href="#${icon}"/></svg>` : ''}${label}${!icon ? '<svg class="ic"><use href="#i-arrow-r"/></svg>' : ''}`;
    n.disabled = !enabled; n.style.opacity = enabled ? '1' : '0.5'; n.style.pointerEvents = enabled ? 'auto' : 'none';
    tip.style.display = enabled ? 'none' : 'block';
    if (!enabled) tip.textContent = cur === 0 ? 'Add all three file types first' : 'Resolve blocking errors first';
  }

  /* ---- UPLOAD ---- */
  function uploadReady() { return files.PD.length && files.LGD.length && files.EAD.length; }
  function renderUploads() {
    ['PD', 'LGD', 'EAD'].forEach(zone => {
      const host = $(`[data-files="${zone}"]`);
      host.innerHTML = files[zone].map((f, i) => `
        <div class="fpill"><span class="fp-ic ${f.status === 'warn' ? 'warn' : 'ok'}"><svg class="ic ic-14"><use href="#i-${f.status === 'warn' ? 'warn' : 'check'}"/></svg></span>
          <div class="fp-meta"><div class="n">${f.name}</div><div class="d">${f.size} · ${f.sheets} sheet${f.sheets === 1 ? '' : 's'}${f.status === 'warn' ? ' · <span style="color:var(--warning)">needs review</span>' : ''}</div></div>
          <button class="btn btn-icon btn-sm" data-rm="${zone}:${i}" aria-label="Remove"><svg class="ic ic-14"><use href="#i-x"/></svg></button>
        </div>`).join('');
      // hide dropzone prompt for single-file zones once filled
      const dz = $(`[data-drop="${zone}"]`);
      if (zone !== 'PD' && files[zone].length) dz.style.display = 'none'; else dz.style.display = 'flex';
    });
  }
  // simulate file add on dropzone click
  let pdExtra = false;
  $$('[data-drop]').forEach(dz => {
    dz.addEventListener('click', () => {
      const zone = dz.dataset.drop;
      if (zone === 'PD' && !pdExtra && files.PD.length === 1) { files.PD.push({ name: 'PD_branch4.xlsx', size: '1.1 MB', sheets: 1, status: 'warn', hash: '7d10…b8e4' }); pdExtra = true; }
      else if (!files[zone].length) { /* re-add default */ }
      renderUploads(); setNext('Continue to validation', uploadReady());
    });
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('over'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('over'));
    dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('over'); dz.click(); });
  });
  document.addEventListener('click', e => {
    const rm = e.target.closest('[data-rm]'); if (!rm) return;
    const [zone, i] = rm.dataset.rm.split(':'); files[zone].splice(+i, 1);
    if (zone === 'PD' && !files.PD.some(f => f.name === 'PD_branch4.xlsx')) pdExtra = false;
    renderUploads(); setNext('Continue to validation', uploadReady());
  });

  /* ---- VALIDATE ---- */
  function runValidation() {
    $('#valScanning').style.display = 'block'; $('#valResults').style.display = 'none';
    setNext('Continue to confirm', false);
    $('#rfNext').disabled = true;
    setTimeout(() => {
      $('#valScanning').style.display = 'none'; $('#valResults').style.display = 'block';
      renderValidation();
    }, 1400);
  }
  function renderValidation() {
    const hasWarn = files.PD.some(f => f.status === 'warn');
    const blocking = files.PD.some(f => f.status === 'block');
    const all = [...files.PD.map(f => ['PD', f]), ...files.LGD.map(f => ['LGD', f]), ...files.EAD.map(f => ['EAD', f])];
    const issueData = {
      'PD_branch4.xlsx': [
        ['warn', 'Unknown segment "Microfinance"', 'Sheet 1 · column F · 14 rows', 'Rows will be grouped under "Unsegmented" unless you add the segment in Admin.'],
        ['warn', 'Blank maturity date', 'Sheet 1 · column M · 3 rows', 'These loans default to the portfolio average maturity.'],
        ['warn', 'Negative outstanding balance', 'Sheet 1 · column J · 1 row', 'Treated as zero exposure.']
      ]
    };
    const sum = $('#valSummary');
    if (blocking) { sum.className = 'val-summary err'; sum.innerHTML = `<span class="vs-ic"><svg class="ic ic-20"><use href="#i-x"/></svg></span><div><div class="vs-t">Blocking errors found</div><div class="vs-d">Fix and re-upload before continuing.</div></div>`; }
    else if (hasWarn) { sum.className = 'val-summary warn'; sum.innerHTML = `<span class="vs-ic"><svg class="ic ic-20"><use href="#i-warn"/></svg></span><div><div class="vs-t">${all.length - 1} files valid · 1 file with 3 warnings</div><div class="vs-d">Warnings won't block the run. Review them below.</div></div>`; }
    else { sum.className = 'val-summary ok'; sum.innerHTML = `<span class="vs-ic"><svg class="ic ic-20"><use href="#i-check"/></svg></span><div><div class="vs-t">All ${all.length} files valid</div><div class="vs-d">No issues found. Ready to compute.</div></div>`; }

    $('#valFiles').innerHTML = all.map(([zone, f], idx) => {
      const issues = issueData[f.name] || [];
      const isOk = !issues.length;
      const icCls = isOk ? 'ok' : 'warn', icBg = isOk ? 'success' : 'warning';
      const status = isOk ? '<span class="pill pill-success"><svg class="ic ic-14"><use href="#i-check"/></svg>Valid</span>' : `<span class="pill pill-warning"><svg class="ic ic-14"><use href="#i-warn"/></svg>${issues.length} warnings</span>`;
      return `<div class="val-file ${isOk ? '' : 'open'}">
        <div class="vf-head" data-vf="${idx}">
          <span class="vf-ic" style="background:var(--${icBg}-subtle);color:var(--${icBg})"><svg class="ic ic-14"><use href="#i-file"/></svg></span>
          <div><div class="vf-name">${f.name}</div><div class="t-caption muted"><span class="tag" style="height:18px">${zone}</span> ${f.size} · ${f.sheets} sheet${f.sheets === 1 ? '' : 's'}</div></div>
          <div class="vf-status">${status}${issues.length ? '<svg class="ic vf-chev"><use href="#i-chev-d"/></svg>' : ''}</div>
        </div>
        ${issues.length ? `<div class="vf-body">${issues.map(([lvl, t, loc, fix]) => `<div class="issue ${lvl === 'warn' ? 'warn' : 'block'}"><svg class="ic iss-ic ic-14"><use href="#i-${lvl === 'warn' ? 'warn' : 'alert'}"/></svg><div><div>${t}</div><div class="iss-loc">${loc}</div><div class="iss-fix">${fix}</div></div></div>`).join('')}<button class="btn btn-secondary btn-sm" style="margin-top:12px"><svg class="ic ic-14"><use href="#i-refresh"/></svg>Re-upload ${f.name}</button></div>` : ''}
      </div>`;
    }).join('');
    $$('[data-vf]').forEach(h => h.addEventListener('click', () => { const f = h.closest('.val-file'); if (h.querySelector('.vf-chev')) f.classList.toggle('open'); }));
    setNext('Continue to confirm', !blocking);
  }

  /* ---- CONFIRM ---- */
  function renderConfirm() {
    $('#cfName').textContent = $('#runName').value || 'May 2026';
    const pd = files.PD.map(f => `<span class="hash-pill"><svg class="ic ic-14"><use href="#i-file"/></svg>${f.name} <span class="subtle">${f.hash}</span></span>`).join('');
    $('#cfPD').innerHTML = `<div class="row-tight wrap" style="gap:6px">${pd}</div>`;
    const combine = $('#cfCombine').closest('.check');
    combine.style.display = files.PD.length > 1 ? 'inline-flex' : 'none';
  }

  /* ---- COMPUTE ---- */
  const C_STAGES = [
    { t: 'PD engine', d: 'Transition matrices · 299 monthly powers', dur: 1600 },
    { t: 'LGD engine', d: 'Discounting collateral · cure rates', dur: 2000 },
    { t: 'EAD engine', d: 'Forward rundown · expected balances', dur: 1600 },
    { t: 'ECL assembly', d: 'PD × LGD × EAD · discounting to today', dur: 1200 }
  ];
  let computeTimers = [];
  function startCompute() {
    terminal = null; renderSteps();
    let stageStates = C_STAGES.map(() => 'pending'); stageStates[0] = 'active';
    renderCompute(stageStates, 0);
    let pct = 0;
    const total = C_STAGES.reduce((a, s) => a + s.dur, 0);
    let elapsed = 0, i = 0;
    computeTimers.forEach(clearTimeout); computeTimers = [];
    function runStage(idx) {
      if (idx >= C_STAGES.length) { finishCompute(true); return; }
      stageStates[idx] = 'active'; for (let k = 0; k < idx; k++) stageStates[k] = 'done';
      renderCompute(stageStates, Math.round((elapsed / total) * 100));
      const start = elapsed;
      const tick = setInterval(() => {
        elapsed += 100;
        const p = Math.min(99, Math.round((elapsed / total) * 100));
        setRing(p);
      }, 100);
      const t = setTimeout(() => { clearInterval(tick); elapsed = start + C_STAGES[idx].dur; stageStates[idx] = 'done'; runStage(idx + 1); }, C_STAGES[idx].dur);
      computeTimers.push(t);
    }
    runStage(0);
  }
  function renderCompute(states, pct) {
    setRing(pct);
    $('#computeTracker').innerHTML = C_STAGES.map((s, i) => {
      const st = states[i];
      const marker = st === 'done' ? '<svg class="ic ic-14"><use href="#i-check"/></svg>' : st === 'active' ? '<span class="spinner" style="width:14px;height:14px"></span>' : (i + 1);
      const meta = st === 'done' ? '<span class="pill pill-success" style="height:20px"><svg class="ic ic-14"><use href="#i-check"/></svg>done</span>' : st === 'active' ? '<span class="t-caption mono muted">running…</span>' : '';
      return `<div class="ctrack ${st}"><div class="cm">${marker}</div><div class="ct-body"><div class="ct-t">${s.t}${meta ? `<span>${meta}</span>` : ''}</div><div class="ct-d">${s.d}</div>${st === 'active' ? '<div class="progress indeterminate ct-bar"><div class="bar"></div></div>' : ''}</div></div>`;
    }).join('');
  }
  function setRing(pct) {
    const r = 44, C = 2 * Math.PI * r, off = C * (1 - pct / 100);
    $('#computeRing').innerHTML = `<svg viewBox="0 0 96 96" width="96" height="96"><circle cx="48" cy="48" r="${r}" fill="none" stroke="var(--surface-sunken)" stroke-width="7"/><circle cx="48" cy="48" r="${r}" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${off}" transform="rotate(-90 48 48)" style="transition:stroke-dashoffset .2s linear"/></svg><span class="pct">${pct}%</span>`;
  }
  function finishCompute(ok) {
    setRing(100);
    terminal = ok ? 'success' : 'failure'; renderSteps();
    setTimeout(() => { showScreen(ok ? 'success' : 'failure'); $('#runFoot').style.display = 'none'; }, 500);
  }

  /* ---- FOOTER NAV ---- */
  $('#rfNext').addEventListener('click', () => { if ($('#rfNext').disabled) return; if (cur < 3) goStep(cur + 1); });
  $('#rfBack').addEventListener('click', () => goStep(cur - 1));

  /* ---- CANCEL ---- */
  const cancelScrim = $('#cancelScrim');
  $('#rfCancel').addEventListener('click', () => cancelScrim.style.display = 'flex');
  $('#exitBtn').addEventListener('click', () => cancelScrim.style.display = 'flex');
  $$('[data-cancel-close]').forEach(b => b.addEventListener('click', () => cancelScrim.style.display = 'none'));
  $('#exitToRuns').addEventListener('click', () => { cancelScrim.style.display = 'none'; goStep(0); });
  cancelScrim.addEventListener('click', e => { if (e.target === cancelScrim) cancelScrim.style.display = 'none'; });

  /* ---- PROTO JUMP ---- */
  $$('[data-jump]').forEach(b => b.addEventListener('click', () => {
    $$('[data-jump]').forEach(x => x.setAttribute('aria-pressed', x === b));
    computeTimers.forEach(clearTimeout);
    const v = b.dataset.jump;
    if (v === 'success' || v === 'failure') { cur = 3; terminal = v; renderSteps(); showScreen(v); $('#runFoot').style.display = 'none'; }
    else { const idx = STEPS.findIndex(s => s.k === v); if (!pdExtra && files.PD.length === 1) { files.PD.push({ name: 'PD_branch4.xlsx', size: '1.1 MB', sheets: 1, status: 'warn', hash: '7d10…b8e4' }); pdExtra = true; } goStep(idx); }
  }));

  /* ---- INIT ---- */
  goStep(0);
})();
