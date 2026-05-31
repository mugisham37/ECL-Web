/* ECL — Flow 0 Design System · interactions + specimen rendering */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;

  /* ---- THEME + DENSITY ---- */
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    $$('[data-theme-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.themeBtn === t));
    try { localStorage.setItem('ecl-theme', t); } catch (e) {}
  }
  function setDensity(d) {
    root.setAttribute('data-density', d);
    $$('[data-density-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.densityBtn === d));
    try { localStorage.setItem('ecl-density', d); } catch (e) {}
  }
  $$('[data-theme-btn]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeBtn)));
  $$('[data-density-btn]').forEach(b => b.addEventListener('click', () => setDensity(b.dataset.densityBtn)));
  try {
    const st = localStorage.getItem('ecl-theme');
    const sd = localStorage.getItem('ecl-density');
    if (st) setTheme(st);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
    if (sd) setDensity(sd);
  } catch (e) {}

  /* ---- COLOR SWATCHES ---- */
  const surfaceToks = [
    ['bg', 'page background'], ['surface', 'cards · panels'], ['surface-raised', 'popovers'],
    ['surface-sunken', 'wells · headers'], ['border', 'hairline'], ['border-strong', 'emphasized'],
    ['text', 'primary'], ['text-muted', 'secondary'], ['text-subtle', 'placeholder']
  ];
  const semanticToks = [
    ['accent', 'brand · action'], ['accent-hover', 'hover'], ['accent-subtle', 'tinted bg'],
    ['info', 'data · cyan'], ['success', 'positive'], ['warning', 'caution'],
    ['danger', 'negative · error'], ['focus', 'focus ring']
  ];
  function hex(varName) {
    const v = getComputedStyle(root).getPropertyValue('--' + varName).trim();
    return v;
  }
  function renderSwatches(host, toks) {
    host.innerHTML = toks.map(([n, role]) => `
      <div class="sw">
        <div class="chip" style="background:var(--${n})"></div>
        <div class="meta"><div class="nm">${n}</div><div class="hx mono" data-hx="${n}">${hex(n)}</div><div class="hx" style="color:var(--text-subtle)">${role}</div></div>
      </div>`).join('');
  }
  function refreshHex() { $$('[data-hx]').forEach(el => el.textContent = hex(el.dataset.hx)); }
  renderSwatches($('[data-swatches="surface"]'), surfaceToks);
  renderSwatches($('[data-swatches="semantic"]'), semanticToks);
  $$('[data-theme-btn]').forEach(b => b.addEventListener('click', () => setTimeout(refreshHex, 20)));

  const ramp = $('[data-ramp="chart"]');
  if (ramp) ramp.innerHTML = Array.from({ length: 8 }, (_, i) =>
    `<div style="background:var(--chart-${i + 1})" title="chart-${i + 1}"></div>`).join('');

  /* ---- SPACING ---- */
  const spacing = $('[data-spacing]');
  if (spacing) spacing.innerHTML = [4, 8, 12, 16, 24, 32, 48, 64].map(n => `
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:9px">
      <span class="mono t-caption" style="width:34px;color:var(--text-subtle)">${n}</span>
      <span style="height:14px;width:${n}px;background:var(--accent);border-radius:2px"></span>
    </div>`).join('');

  /* ---- MOTION ---- */
  const motion = $('[data-motion]');
  const motToks = [
    ['micro', '120ms', 'hover · focus · press'],
    ['fast', '180ms', 'tab change · sticky dock · expand'],
    ['base', '240ms', 'modal · chart entrance · reveal'],
    ['slow', '320ms', 'full-panel transition (max)']
  ];
  if (motion) motion.innerHTML = motToks.map(([t, v, u]) => `
    <div class="tok motion-row" style="grid-template-columns:140px 90px 1fr;padding:11px var(--sp-4);cursor:default">
      <code>--t-${t}</code><span class="mono t-caption">${v}</span>
      <span class="row" style="justify-content:space-between"><span class="muted t-caption">${u}</span>
        <span class="mo-dot" style="width:14px;height:14px;border-radius:3px;background:var(--accent);transition:transform var(--t-${t}) var(--ease-out)"></span></span>
    </div>`).join('');
  $$('.motion-row').forEach(r => {
    const d = r.querySelector('.mo-dot');
    r.addEventListener('mouseenter', () => d.style.transform = 'translateX(-180px)');
    r.addEventListener('mouseleave', () => d.style.transform = 'translateX(0)');
  });

  /* ---- ICONS ---- */
  const iconNames = ['home', 'runs', 'results', 'admin', 'settings', 'file', 'upload', 'download',
    'search', 'bell', 'user', 'check', 'x', 'warn', 'alert', 'info', 'lock', 'plus',
    'filter', 'copy', 'hash', 'clock', 'refresh', 'table', 'db', 'eye', 'edit', 'trash',
    'chev-d', 'chev-r', 'arrow-r', 'zap'];
  const iconsHost = $('[data-icons]');
  if (iconsHost) iconsHost.innerHTML = iconNames.map(n =>
    `<div class="i"><svg class="ic ic-20"><use href="#i-${n}"/></svg><span>${n}</span></div>`).join('');

  /* ---- SEGMENTS DATA TABLE ---- */
  const segData = [
    ['Transport', [62, 26, 12], 318450, 12940000, '2.46%', +5.1],
    ['Agriculture', [70, 21, 9], 264120, 11380000, '2.32%', -1.4],
    ['Trade', [58, 28, 14], 211880, 7620000, '2.78%', +3.2],
    ['Manufacturing', [66, 24, 10], 178300, 8110000, '2.20%', +0.6],
    ['Real Estate', [74, 18, 8], 142960, 9240000, '1.55%', -2.8],
    ['Education', [80, 14, 6], 88410, 5130000, '1.72%', +1.1],
    ['SME', [55, 30, 15], 79560, 3010000, '2.64%', +6.7],
    ['Personal', [61, 27, 12], -8820, 540000, '—', 0]
  ];
  const fmt = n => Math.abs(n).toLocaleString('en-US');
  const tbody = $('[data-segments]');
  if (tbody) tbody.innerHTML = segData.map(([seg, mix, ecl, out, cov, delta]) => {
    const eclCell = ecl < 0 ? `<span class="amount neg">(${fmt(ecl)})</span>` : `<span class="amount">${fmt(ecl)}</span>`;
    const dCls = delta > 0 ? 'delta-up' : delta < 0 ? 'delta-down' : 'delta-flat';
    const dTxt = delta === 0 ? '—' : (delta > 0 ? '+' : '−') + Math.abs(delta).toFixed(1) + '%';
    const bar = mix.map((p, i) => `<span style="height:8px;width:${p}%;background:var(--chart-${i === 0 ? 8 : i === 1 ? 3 : 7})" title="Stage ${i + 1}: ${p}%"></span>`).join('');
    return `<tr>
      <td class="col-check"><label class="check"><input type="checkbox" class="row-check"><span class="box"><svg viewBox="0 0 24 24"><use href="#i-check"/></svg></span></label></td>
      <td style="font-weight:500">${seg}</td>
      <td><span style="display:flex;width:120px;border-radius:3px;overflow:hidden;border:1px solid var(--border)">${bar}</span></td>
      <td class="num">${eclCell}</td>
      <td class="num">${fmt(out)}</td>
      <td class="num">${cov}</td>
      <td class="num"><span class="delta ${dCls}">${dTxt}</span></td>
    </tr>`;
  }).join('');

  const checkAll = $('[data-check-all]');
  if (checkAll) checkAll.addEventListener('change', e => {
    $$('.row-check').forEach(c => { c.checked = e.target.checked; c.closest('tr').classList.toggle('selected', e.target.checked); });
  });
  $$('.row-check').forEach(c => c.addEventListener('change', () => c.closest('tr').classList.toggle('selected', c.checked)));

  /* ---- MATRIX TABLE ---- */
  const M = [
    ['', 'Stage 1', 'Stage 2', 'Stage 3'],
    ['Stage 1', 0.942, 0.051, 0.007],
    ['Stage 2', 0.214, 0.689, 0.097],
    ['Stage 3', 0.038, 0.061, 0.901]
  ];
  const matrix = $('[data-matrix]');
  if (matrix) matrix.innerHTML = M.map((row, ri) => '<tr>' + row.map((c, ci) => {
    if (ri === 0 || ci === 0) return `<th>${c}</th>`;
    const v = c, alpha = (0.06 + v * 0.5).toFixed(2);
    return `<td style="background:color-mix(in srgb, var(--accent) ${Math.round(v * 60)}%, transparent);color:${v > 0.5 ? 'var(--text)' : 'var(--text-muted)'}">${v.toFixed(3)}</td>`;
  }).join('') + '</tr>').join('');

  /* ---- KPIs ---- */
  const kpis = [
    ['Total ECL', 'KES', '1,284,500', 'delta-up', 'i-up', '+4.2% vs Apr'],
    ['Coverage ratio', '', '2.41%', 'delta-down', 'i-down', '−0.12pp'],
    ['Total outstanding', 'KES', '57.4M', 'delta-flat', '', '—'],
    ['Loans analysed', '', '11,847', 'delta-up', 'i-up', '+312']
  ];
  const kpiHost = $('[data-kpis]');
  if (kpiHost) kpiHost.innerHTML = kpis.map(([l, c, v, dc, ic, dt]) => `
    <div class="kpi"><span class="label">${l}</span>
      <span class="value">${c ? `<span class="cur">${c}</span>` : ''}${v}</span>
      <span class="delta ${dc}">${ic ? `<svg class="ic ic-14"><use href="#${ic}"/></svg>` : ''}${dt}</span>
    </div>`).join('');

  /* ---- BAR CHART (svg) ---- */
  const bars = [['Transport', 318], ['Agriculture', 264], ['Trade', 212], ['Manufacturing', 178], ['Real Estate', 143], ['Education', 88]];
  const barHost = $('[data-barchart]');
  if (barHost) {
    const max = 320, W = 460, rowH = 30;
    barHost.innerHTML = `<svg viewBox="0 0 ${W} ${bars.length * rowH}" width="100%" role="img" aria-label="ECL by segment bar chart">
      ${bars.map(([n, v], i) => {
        const y = i * rowH, bw = (v / max) * 300;
        return `<text x="0" y="${y + 19}" font-size="12" fill="var(--text-muted)" font-family="var(--font-ui)">${n}</text>
          <rect x="118" y="${y + 7}" width="${bw}" height="16" rx="3" fill="var(--chart-1)"></rect>
          <text x="${118 + bw + 8}" y="${y + 19}" font-size="12" fill="var(--text)" font-family="var(--font-mono)">${v}k</text>`;
      }).join('')}
    </svg>`;
  }

  /* ---- DONUT (svg) ---- */
  const donutHost = $('[data-donut]');
  if (donutHost) {
    const segs = [['Stage 1', 58, 8], ['Stage 2', 27, 3], ['Stage 3', 15, 7]];
    let off = 0, C = 2 * Math.PI * 52;
    const arcs = segs.map(([n, p, c]) => {
      const len = (p / 100) * C, dash = `${len} ${C - len}`, el = `<circle cx="70" cy="70" r="52" fill="none" stroke="var(--chart-${c})" stroke-width="16" stroke-dasharray="${dash}" stroke-dashoffset="${-off}" transform="rotate(-90 70 70)"></circle>`;
      off += len; return el;
    }).join('');
    donutHost.innerHTML = `<svg viewBox="0 0 140 140" width="140" height="140" role="img" aria-label="ECL by stage donut">${arcs}
      <text x="70" y="66" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Lifetime</text>
      <text x="70" y="84" text-anchor="middle" font-size="17" fill="var(--text)" font-family="var(--font-mono)" font-weight="500">42%</text></svg>
      <div class="col" style="gap:10px">${segs.map(([n, p, c]) => `<div class="row-tight"><span style="width:10px;height:10px;border-radius:2px;background:var(--chart-${c})"></span><span class="t-body" style="width:64px">${n}</span><span class="mono t-caption">${p}%</span></div>`).join('')}</div>`;
  }

  /* ---- LINE CHART (svg) ---- */
  const lineHost = $('[data-linechart]');
  if (lineHost) {
    const pts = [108, 116, 112, 124, 131, 122, 118, 129, 137, 133, 123, 128];
    const labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    const W = 760, H = 160, pad = 24, min = 100, max = 145;
    const xy = pts.map((v, i) => [pad + (i / (pts.length - 1)) * (W - pad * 2), H - pad - ((v - min) / (max - min)) * (H - pad * 2)]);
    const path = xy.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const area = path + ` L${xy[xy.length - 1][0].toFixed(1)} ${H - pad} L${pad} ${H - pad} Z`;
    lineHost.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="12-month ECL trend">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity="0.18"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
      ${[0, 1, 2, 3].map(i => `<line x1="${pad}" x2="${W - pad}" y1="${pad + i * (H - pad * 2) / 3}" y2="${pad + i * (H - pad * 2) / 3}" stroke="var(--border)" stroke-width="1"/>`).join('')}
      <path d="${area}" fill="url(#lg)"/>
      <path d="${path}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      ${xy.map((p, i) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i === pts.length - 1 ? 3.5 : 0}" fill="var(--accent)"/>`).join('')}
      ${labels.map((l, i) => `<text x="${(pad + (i / (pts.length - 1)) * (W - pad * 2)).toFixed(1)}" y="${H - 6}" text-anchor="middle" font-size="10" fill="var(--text-subtle)" font-family="var(--font-mono)">${l}</text>`).join('')}
    </svg>`;
  }

  /* ---- COPY ---- */
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => {
    const t = b.textContent.trim();
    navigator.clipboard && navigator.clipboard.writeText(t).catch(() => {});
    const orig = b.innerHTML;
    b.innerHTML = 'Copied <svg class="ic"><use href="#i-check"/></svg>';
    setTimeout(() => b.innerHTML = orig, 1200);
  }));

  /* ---- NAV SCROLLSPY ---- */
  const links = $$('.ds-nav a');
  const map = {};
  links.forEach(a => { const id = a.getAttribute('href').slice(1); if ($('#' + id)) map[id] = a; });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { links.forEach(l => l.classList.remove('active')); map[e.target.id] && map[e.target.id].classList.add('active'); }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  $$('.sec').forEach(s => obs.observe(s));
})();
