/* ECL — Flow 4 Dashboard · AppShell nav, state switcher, charts */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const app = $('#app');

  /* ---- THEME ---- */
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    $$('[data-theme-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.themeBtn === t));
    const sw = $('#themeSwitch'); if (sw) sw.checked = t === 'dark';
    try { localStorage.setItem('ecl-theme', t); } catch (e) {}
    renderCharts(); // re-tint SVGs to theme tokens
  }
  $$('[data-theme-btn]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeBtn)));
  $('#themeSwitch').addEventListener('change', e => setTheme(e.target.checked ? 'dark' : 'light'));

  /* ---- SIDEBAR ---- */
  $('#collapseBtn').addEventListener('click', () => {
    app.dataset.side = app.dataset.side === 'collapsed' ? 'expanded' : 'collapsed';
  });
  $('#menuBtn').addEventListener('click', () => { app.dataset.side = 'open'; $('#sideScrim').classList.add('open'); });
  $('#sideScrim').addEventListener('click', () => { app.dataset.side = 'expanded'; $('#sideScrim').classList.remove('open'); });
  $$('.side-link').forEach(l => l.addEventListener('click', () => { $$('.side-link').forEach(x => x.classList.remove('active')); l.classList.add('active'); if (innerWidth < 768) { app.dataset.side = 'expanded'; $('#sideScrim').classList.remove('open'); } }));

  /* ---- MENUS ---- */
  function wireMenu(btnId, popId) {
    const btn = $('#' + btnId), pop = $('#' + popId);
    btn.addEventListener('click', e => { e.stopPropagation(); const open = pop.classList.contains('open'); closeAll(); if (!open) pop.classList.add('open'); });
  }
  function closeAll() { $$('.menu-pop').forEach(p => p.classList.remove('open')); }
  wireMenu('tenantBtn', 'tenantPop'); wireMenu('bellBtn', 'notifPop'); wireMenu('avatarBtn', 'avatarPop');
  document.addEventListener('click', closeAll);
  $$('.menu-pop').forEach(p => p.addEventListener('click', e => { if (!e.target.closest('#themeToggleItem')) { /* allow */ } e.stopPropagation(); }));
  $('#themeToggleItem').addEventListener('click', e => { if (e.target.closest('.switch')) return; const s = $('#themeSwitch'); s.checked = !s.checked; setTheme(s.checked ? 'dark' : 'light'); });

  /* ===== DATA ===== */
  const KES = n => Math.abs(n).toLocaleString('en-US');
  const segData = [['Transport', 318], ['Agriculture', 264], ['Trade', 212], ['Manufacturing', 178], ['Real Estate', 143], ['Education', 88]];
  const stageData = [['Stage 1', 58, 8], ['Stage 2', 27, 3], ['Stage 3', 15, 7]];
  const trend = [108, 116, 112, 124, 131, 122, 118, 129, 137, 133, 123, 128];
  const trendLabels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const runs = [
    ['c81a…77fe', 'May 2026', 'TM', 'Tendai Mwangi', 'success', 1284500],
    ['b40d…91a2', 'Apr 2026', 'AK', 'A. Karanja', 'success', 1232040],
    ['7f2e…03cc', 'Apr 2026', 'JO', 'J. Otieno', 'failed', null],
    ['e918…5b6d', 'Mar 2026', 'TM', 'Tendai Mwangi', 'success', 1201880]
  ];

  /* ---- KPI RENDER ---- */
  function kpiCards(opts) {
    opts = opts || {};
    const lock = opts.locked ? ' locked' : '';
    const cards = [
      { l: 'Total ECL', cur: 'KES', v: opts.stale ? '1,198,200' : '1,284,500', dc: 'delta-up', ic: 'i-up', dt: opts.stale ? 'as of 30 Apr' : '+4.2%', note: opts.stale ? 'last successful run' : 'vs previous run' },
      { l: 'Coverage ratio', cur: '', v: '2.41%', dc: 'delta-down', ic: 'i-down', dt: '−0.12pp', note: 'vs previous run', help: 'ECL ÷ total outstanding' },
      { l: 'Total outstanding', cur: 'KES', v: '57.4M', dc: 'delta-flat', ic: '', dt: '—', note: '11,847 loans' },
      { l: 'Loans analysed', cur: '', v: '11,847', dc: 'delta-up', ic: 'i-up', dt: '+312', note: 'vs previous run' }
    ];
    return cards.map(c => `
      <div class="kpi${lock}">
        <span class="label">${c.l}${c.help ? ` <span class="help tip"><svg class="ic ic-14"><use href="#i-help"/></svg><span class="tip-body">${c.help}</span></span>` : ''}</span>
        <span class="value">${c.cur ? `<span class="cur">${c.cur}</span>` : ''}${c.v}</span>
        <span class="delta ${c.dc}">${c.ic ? `<svg class="ic ic-14"><use href="#${c.ic}"/></svg>` : ''}${c.dt}</span>
        <span class="subnote">${c.note}</span>
      </div>`).join('');
  }

  /* ---- RUNS RENDER ---- */
  function runsRows() {
    return runs.map(([id, period, init, name, status, ecl]) => {
      const pill = status === 'success'
        ? '<span class="pill pill-success"><svg class="ic ic-14"><use href="#i-check"/></svg>Complete</span>'
        : '<span class="pill pill-danger"><svg class="ic ic-14"><use href="#i-x"/></svg>Failed</span>';
      const amount = ecl == null ? '<span class="amount zero">—</span>' : `<span class="amount">${KES(ecl)}</span>`;
      return `<tr>
        <td><span class="run-id">${id}<svg class="ic ic-14"><use href="#i-copy"/></svg></span></td>
        <td>${period}</td>
        <td><span class="by-cell"><span class="avatar avatar-sm">${init}</span><span class="muted t-caption">${name}</span></span></td>
        <td>${pill}</td>
        <td class="num">${amount}</td>
        <td><button class="btn btn-icon btn-sm" aria-label="View"><svg class="ic ic-14"><use href="#i-eye"/></svg></button></td>
      </tr>`;
    }).join('');
  }

  /* ---- CHARTS ---- */
  function renderCharts() {
    // bar
    const max = 320, host = $('#barChart');
    if (host) host.innerHTML = `<svg viewBox="0 0 460 ${segData.length * 30}" width="100%" role="img" aria-label="ECL by segment">
      ${segData.map(([n, v], i) => { const y = i * 30, bw = (v / max) * 290; return `<text x="0" y="${y + 19}" font-size="12" fill="var(--text-muted)" font-family="var(--font-ui)">${n}</text><rect x="118" y="${y + 7}" width="${bw}" height="16" rx="3" fill="var(--chart-1)"></rect><text x="${118 + bw + 8}" y="${y + 19}" font-size="12" fill="var(--text)" font-family="var(--font-mono)">${v}k</text>`; }).join('')}
    </svg>`;
    // donut
    const dhost = $('#donut');
    if (dhost) {
      let off = 0, C = 2 * Math.PI * 52;
      const arcs = stageData.map(([n, p, c]) => { const len = (p / 100) * C, el = `<circle cx="70" cy="70" r="52" fill="none" stroke="var(--chart-${c})" stroke-width="16" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-off}" transform="rotate(-90 70 70)"></circle>`; off += len; return el; }).join('');
      dhost.innerHTML = `<svg viewBox="0 0 140 140" width="134" height="134" role="img" aria-label="ECL by stage">${arcs}<text x="70" y="65" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Lifetime</text><text x="70" y="84" text-anchor="middle" font-size="18" fill="var(--text)" font-family="var(--font-mono)" font-weight="500">42%</text></svg>
        <div class="legend">${stageData.map(([n, p, c]) => `<div class="lg"><span class="sw" style="background:var(--chart-${c})"></span><span>${n}</span><span class="v">${p}%</span></div>`).join('')}</div>`;
    }
    // trend
    const thost = $('#trendChart');
    if (thost) {
      const W = 1080, H = 200, pad = 30, min = 100, max2 = 145;
      const xy = trend.map((v, i) => [pad + (i / (trend.length - 1)) * (W - pad * 2), H - pad - ((v - min) / (max2 - min)) * (H - pad * 2)]);
      const path = xy.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
      const area = path + ` L${xy[xy.length - 1][0].toFixed(1)} ${H - pad} L${pad} ${H - pad} Z`;
      thost.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="12-month ECL trend">
        <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity="0.16"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
        ${[0, 1, 2, 3].map(i => `<line x1="${pad}" x2="${W - pad}" y1="${(pad + i * (H - pad * 2) / 3).toFixed(0)}" y2="${(pad + i * (H - pad * 2) / 3).toFixed(0)}" stroke="var(--border)" stroke-width="1"/>`).join('')}
        <path d="${area}" fill="url(#tg)"/>
        <path d="${path}" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
        <circle cx="${xy[xy.length - 1][0].toFixed(1)}" cy="${xy[xy.length - 1][1].toFixed(1)}" r="4" fill="var(--accent)"/>
        ${trendLabels.map((l, i) => `<text x="${(pad + (i / (trend.length - 1)) * (W - pad * 2)).toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="var(--text-subtle)" font-family="var(--font-mono)">${l}</text>`).join('')}
      </svg>`;
    }
  }

  /* ===== STATE SWITCHER ===== */
  function setState(state) {
    $$('[data-state]').forEach(b => b.setAttribute('aria-pressed', b.dataset.state === state));
    const body = $('#dashBody'), empty = $('#dashEmpty'), loading = $('#dashLoading'), banner = $('#bannerSlot');
    const actions = $('#phActions'), ctx = $('#phContext');
    [body, empty, loading].forEach(el => el.style.display = 'none');
    banner.innerHTML = '';
    actions.style.visibility = 'visible';

    if (state === 'loading') { loading.style.display = 'block'; ctx.textContent = 'Loading…'; return; }
    if (state === 'empty') {
      empty.style.display = 'block'; ctx.textContent = 'No runs yet'; actions.style.visibility = 'hidden';
      return;
    }
    if (state === 'incomplete') {
      empty.style.display = 'none'; body.style.display = 'block'; actions.style.visibility = 'hidden';
      ctx.textContent = 'Setup incomplete';
      banner.innerHTML = `<div class="dash-banner incomplete"><svg class="ic"><use href="#i-info"/></svg><span class="grow"><strong>Finish setting up Savanna Bank.</strong> Your team can't run ECLs until segments and collateral types are configured.</span><button class="btn btn-primary btn-sm">Resume setup<svg class="ic ic-14"><use href="#i-arrow-r"/></svg></button></div>`;
      $('#kpiStrip').innerHTML = kpiCards({ locked: true });
      // blank the charts area to lock visuals
      lockBody(true);
      $('#runsBody').innerHTML = `<tr><td colspan="6"><div class="state" style="padding:28px"><div class="state-ic"><svg class="ic ic-20"><use href="#i-runs"/></svg></div><h3>No runs yet</h3><p>Complete setup to enable runs.</p></div></td></tr>`;
      renderCharts();
      return;
    }
    body.style.display = 'block';
    lockBody(false);
    $('#kpiStrip').innerHTML = kpiCards(state === 'failed' ? { stale: true } : {});
    $('#runsBody').innerHTML = runsRows();
    renderCharts();

    if (state === 'running') {
      ctx.textContent = 'Run in progress';
      banner.innerHTML = `<div class="dash-banner running"><span class="spinner" style="width:18px;height:18px"></span><div class="run-progress"><div class="rp-top"><span><strong>Computing May 2026 ECL…</strong> <span class="muted">LGD engine · 1,247 loans</span></span><span class="mono t-caption muted">45%</span></div><div class="progress"><div class="bar" style="width:45%"></div></div></div><button class="btn btn-secondary btn-sm">View run</button></div>`;
    } else if (state === 'failed') {
      ctx.textContent = 'Last run failed';
      banner.innerHTML = `<div class="dash-banner failed"><svg class="ic"><use href="#i-warn"/></svg><span class="grow"><strong>Your last run on 28 May failed at the LGD stage.</strong> Figures below reflect the last successful run on 30 Apr. <span class="mono t-caption">ref a3f9-2c1b</span></span><button class="btn btn-secondary btn-sm"><svg class="ic ic-14"><use href="#i-refresh"/></svg>Retry run</button></div>`;
    } else {
      ctx.textContent = 'Last run 30 May 2026';
    }
  }
  function lockBody(locked) {
    $$('.dash-grid, .trend-card').forEach(el => { el.style.opacity = locked ? '0.45' : '1'; el.style.pointerEvents = locked ? 'none' : 'auto'; });
  }
  $$('[data-state]').forEach(b => b.addEventListener('click', () => setState(b.dataset.state)));

  /* ---- INIT ---- */
  try { const st = localStorage.getItem('ecl-theme'); if (st) setTheme(st); else if (matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark'); else setTheme('light'); } catch (e) { setTheme('light'); }
  setState('healthy');
})();
