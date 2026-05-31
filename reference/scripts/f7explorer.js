/* ECL — Flow 7 Results Explorer · drill nav, tables, PD matrix, loan chain */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const app = $('#app');

  /* ---- THEME + SHELL ---- */
  function setTheme(t) { root.setAttribute('data-theme', t); $$('[data-theme-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.themeBtn === t)); try { localStorage.setItem('ecl-theme', t); } catch (e) {} renderMatrix(); }
  $$('[data-theme-btn]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeBtn)));
  try { const st = localStorage.getItem('ecl-theme'); if (st) setTheme(st); else if (matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark'); } catch (e) {}
  $('#collapseBtn').addEventListener('click', () => { app.dataset.side = app.dataset.side === 'collapsed' ? 'expanded' : 'collapsed'; });
  $('#menuBtn').addEventListener('click', () => { app.dataset.side = 'open'; $('#sideScrim').classList.add('open'); });
  $('#sideScrim').addEventListener('click', () => { app.dataset.side = 'expanded'; $('#sideScrim').classList.remove('open'); });

  /* ---- DENSITY ---- */
  $('#densityBtn').addEventListener('click', () => {
    const d = root.getAttribute('data-density') === 'compact' ? 'comfortable' : 'compact';
    root.setAttribute('data-density', d);
    $('#densityBtn').innerHTML = `<svg class="ic ic-14"><use href="#i-compress"/></svg>${d === 'compact' ? 'Compact' : 'Comfortable'}`;
  });

  /* ---- MENUS ---- */
  function wireMenu(btnId, popId) { const b = $('#' + btnId), p = $('#' + popId); if (!b) return; b.addEventListener('click', e => { e.stopPropagation(); const o = p.classList.contains('open'); closeAll(); if (!o) p.classList.add('open'); }); }
  function closeAll() { $$('.menu-pop').forEach(p => p.classList.remove('open')); }
  wireMenu('exportBtn', 'exportPop'); wireMenu('stageFilter', 'stagePop');
  document.addEventListener('click', closeAll);
  $$('.menu-pop').forEach(p => p.addEventListener('click', e => e.stopPropagation()));

  /* ===== DATA ===== */
  const KES = n => Math.abs(n).toLocaleString('en-US');
  const segData = [
    { name: 'Transport', mix: [62, 26, 12], ecl: 318450, out: 12940000, cov: '2.46%', loans: 1284, d: +5.1 },
    { name: 'Agriculture', mix: [70, 21, 9], ecl: 264120, out: 11380000, cov: '2.32%', loans: 2110, d: -1.4 },
    { name: 'Trade', mix: [58, 28, 14], ecl: 211880, out: 7620000, cov: '2.78%', loans: 1740, d: +3.2 },
    { name: 'Manufacturing', mix: [66, 24, 10], ecl: 178300, out: 8110000, cov: '2.20%', loans: 980, d: +0.6 },
    { name: 'Real Estate', mix: [74, 18, 8], ecl: 142960, out: 9240000, cov: '1.55%', loans: 420, d: -2.8 },
    { name: 'Education', mix: [80, 14, 6], ecl: 88410, out: 5130000, cov: '1.72%', loans: 1310, d: +1.1 },
    { name: 'SME', mix: [55, 30, 15], ecl: 79560, out: 3010000, cov: '2.64%', loans: 2003, d: +6.7 }
  ];
  const loans = [
    ['TRN-04821', 'Mwangi Transporters Ltd', 2, 11.4, 38.5, 2410000, 105820],
    ['TRN-04822', 'Rift Cargo Co', 1, 2.1, 35.0, 1820000, 13380],
    ['TRN-04825', 'Coast Haulage', 3, 64.0, 52.0, 940000, 312900],
    ['TRN-04830', 'Nyeri Movers', 1, 1.8, 30.5, 2110000, 11620],
    ['TRN-04833', 'Eastlands Logistics', 2, 9.7, 41.0, 1560000, 62050],
    ['TRN-04840', 'Savannah Express', 1, 2.4, 33.2, 3050000, 24290],
    ['TRN-04846', 'Mombasa Freight', 3, 71.0, 48.0, 680000, 231740],
    ['TRN-04851', 'Highland Carriers', 2, 8.9, 39.5, 1290000, 45360]
  ];
  const MATRIX = [[0.942, 0.051, 0.007], [0.214, 0.689, 0.097], [0.038, 0.061, 0.901]];

  /* ===== DRILL STATE ===== */
  let level = 'portfolio'; // portfolio | segment | loan | empty
  let curSeg = 'Transport', curLoan = 'TRN-04821';

  function setCrumb() {
    const c = $('#crumb');
    let html = `<a data-go="portfolio" class="${level === 'portfolio' ? 'current' : ''}">All segments</a>`;
    if (level === 'segment' || level === 'loan') html += `<span class="sep"><svg class="ic ic-14"><use href="#i-chev-r"/></svg></span><a data-go="segment" class="${level === 'segment' ? 'current' : ''}">${curSeg}</a>`;
    if (level === 'loan') html += `<span class="sep"><svg class="ic ic-14"><use href="#i-chev-r"/></svg></span><a class="current">Loan ${curLoan}</a>`;
    c.innerHTML = html;
    $$('#crumb a[data-go]').forEach(a => a.addEventListener('click', () => drill(a.dataset.go)));
  }

  function drill(lvl) {
    level = lvl;
    $$('.rx-view').forEach(v => v.classList.remove('active'));
    $('#rx-' + lvl).classList.add('active');
    setCrumb();
    // toolbar relevance: search/stage only meaningful in segment/portfolio
    $('.rx-toolbar').style.display = lvl === 'loan' ? 'none' : 'flex';
    if (lvl === 'portfolio') renderPortfolio();
    if (lvl === 'segment') renderSegment();
    if (lvl === 'loan') renderLoan();
    if (lvl === 'empty') { $('#rowSummary').textContent = '0 results'; }
    $$('[data-jump]').forEach(b => b.setAttribute('aria-pressed', b.dataset.jump === lvl));
    window.scrollTo({ top: 0 });
  }

  /* ---- PORTFOLIO ---- */
  function renderPortfolio() {
    $('#pfKpis').innerHTML = [
      ['Total ECL', 'KES', '1,284,500'], ['Coverage ratio', '', '2.41%'],
      ['Total outstanding', 'KES', '57.4M'], ['Loans analysed', '', '11,847']
    ].map(([l, c, v]) => `<div class="kpi"><span class="label">${l}</span><span class="value">${c ? `<span class="cur">${c}</span>` : ''}${v}</span></div>`).join('');

    $('#pfBody').innerHTML = segData.map(s => {
      const bar = s.mix.map((p, i) => `<span style="width:${p}%;background:var(--chart-${i === 0 ? 8 : i === 1 ? 3 : 7})" title="Stage ${i + 1}: ${p}%"></span>`).join('');
      const dCls = s.d > 0 ? 'delta-up' : s.d < 0 ? 'delta-down' : 'delta-flat';
      const dTxt = (s.d > 0 ? '+' : '−') + Math.abs(s.d).toFixed(1) + '%';
      const ic = s.d > 0 ? 'i-up' : s.d < 0 ? 'i-down' : '';
      return `<tr class="drillable" data-seg="${s.name}">
        <td><span class="seg-link">${s.name}</span></td>
        <td><span class="stage-mix-bar">${bar}</span></td>
        <td class="num">${KES(s.ecl)}</td>
        <td class="num">${KES(s.out)}</td>
        <td class="num">${s.cov}</td>
        <td class="num">${s.loans.toLocaleString()}</td>
        <td class="num"><span class="delta ${dCls}">${ic ? `<svg class="ic ic-14"><use href="#${ic}"/></svg>` : ''}${dTxt}</span></td>
        <td class="num"><svg class="ic ic-14 subtle"><use href="#i-chev-r"/></svg></td>
      </tr>`;
    }).join('');
    const totalEcl = segData.reduce((a, s) => a + s.ecl, 0);
    const totalOut = segData.reduce((a, s) => a + s.out, 0);
    const totalLoans = segData.reduce((a, s) => a + s.loans, 0);
    $('#pfFoot').innerHTML = `<tr style="font-weight:var(--fw-semibold)"><td colspan="2" style="border-top:2px solid var(--border-strong)">Total · 7 segments</td><td class="num" style="border-top:2px solid var(--border-strong)">${KES(totalEcl)}</td><td class="num" style="border-top:2px solid var(--border-strong)">${KES(totalOut)}</td><td class="num" style="border-top:2px solid var(--border-strong)">2.41%</td><td class="num" style="border-top:2px solid var(--border-strong)">${totalLoans.toLocaleString()}</td><td colspan="2" style="border-top:2px solid var(--border-strong)"></td></tr>`;
    $$('#pfBody tr').forEach(tr => tr.addEventListener('click', () => { curSeg = tr.dataset.seg; drill('segment'); }));
    $('#rowSummary').textContent = '7 segments · KES ' + KES(totalEcl);
  }

  /* ---- SEGMENT ---- */
  function renderSegment() {
    const s = segData.find(x => x.name === curSeg) || segData[0];
    $('.panel-head .t-caption').textContent = 'monthly · ' + curSeg;
    $$('#rx-segment h3').forEach(h => { if (h.textContent.startsWith('Loans')) h.textContent = 'Loans · ' + curSeg; });
    $('#segKpis').innerHTML = [
      ['Segment ECL', 'KES', KES(s.ecl)], ['Coverage', '', s.cov], ['Loans', '', s.loans.toLocaleString()]
    ].map(([l, c, v]) => `<div class="kpi"><span class="label">${l}</span><span class="value">${c ? `<span class="cur">${c}</span>` : ''}${v}</span></div>`).join('');
    renderMatrix();
    // stage distribution
    $('#stageDist').innerHTML = s.mix.map((p, i) => `
      <div class="sd"><div class="sd-top"><span class="stage stage-${i + 1}">Stage ${i + 1}</span><span class="mono muted">${p}%</span></div>
      <div class="sd-bar"><span style="width:${p}%;background:var(--chart-${i === 0 ? 8 : i === 1 ? 3 : 7})"></span></div></div>`).join('');
    // loans
    $('#segLoanBody').innerHTML = loans.map(([id, cust, stage, pd, lgd, ead, ecl]) => `
      <tr class="drillable" data-loan="${id}">
        <td><span class="loan-link mono">${id}</span></td>
        <td>${cust}</td>
        <td><span class="stage stage-${stage}">Stage ${stage}</span></td>
        <td class="num">${pd.toFixed(1)}%</td>
        <td class="num">${lgd.toFixed(1)}%</td>
        <td class="num">${KES(ead)}</td>
        <td class="num" style="font-weight:var(--fw-medium)">${KES(ecl)}</td>
        <td class="num"><svg class="ic ic-14 subtle"><use href="#i-chev-r"/></svg></td>
      </tr>`).join('');
    $$('#segLoanBody tr').forEach(tr => tr.addEventListener('click', () => { curLoan = tr.dataset.loan; drill('loan'); }));
    $('#segLoanFoot').textContent = 'Showing 8 of ' + s.loans.toLocaleString();
    $('#rowSummary').textContent = s.loans.toLocaleString() + ' loans · KES ' + KES(s.ecl);
  }

  /* ---- PD MATRIX ---- */
  function renderMatrix() {
    const m = $('#pdMatrix'); if (!m) return;
    const stages = ['Stage 1', 'Stage 2', 'Stage 3'];
    let html = `<tr><td class="corner"></td><td class="axis" colspan="3">TO STAGE →</td></tr>`;
    html += `<tr><td class="corner"></td>${stages.map(s => `<th class="colhead">${s}</th>`).join('')}</tr>`;
    MATRIX.forEach((row, ri) => {
      html += `<tr><th class="rowhead">${stages[ri]}</th>${row.map(v => {
        const pct = Math.round(v * 100);
        const tint = Math.round(v * 72);
        const light = v < 0.45;
        return `<td class="cell" style="background:color-mix(in srgb, var(--accent) ${tint}%, transparent);color:${light ? 'var(--text-muted)' : '#fff'}" title="P = ${v.toFixed(3)}">${v.toFixed(3)}<span class="pctsmall">${pct}%</span></td>`;
      }).join('')}</tr>`;
    });
    m.innerHTML = html;
    const sc = $('#matrixScale');
    if (sc) sc.style.background = 'linear-gradient(90deg, color-mix(in srgb, var(--accent) 4%, transparent), var(--accent))';
  }

  /* ---- LOAN ---- */
  function renderLoan() {
    $('#rx-loan .loan-id-head h2').textContent = curLoan;
    const rd = [
      [1, 0.95, 0.95, 2410000, 920], [2, 0.91, 1.86, 2388000, 1760], [3, 0.93, 2.78, 2366000, 2580],
      [4, 1.02, 3.79, 2344000, 3470], [5, 1.08, 4.84, 2321000, 4360], [6, 1.05, 5.86, 2298000, 5180],
      [7, 0.98, 6.81, 2274000, 5910], [8, 1.04, 7.82, 2251000, 6720]
    ];
    $('#rundownBody').innerHTML = rd.map(([mo, mpd, cpd, ead, ecl]) => `
      <tr><td class="mono">M${String(mo).padStart(2, '0')}</td>
      <td class="num">${mpd.toFixed(2)}%</td><td class="num">${cpd.toFixed(2)}%</td>
      <td class="num">${KES(ead)}</td><td class="num">${KES(ecl)}</td></tr>`).join('');
    $('#rowSummary').textContent = 'Loan ' + curLoan;
  }

  /* ---- FILTERS (demo) ---- */
  let stageFilters = [true, true, true];
  $$('.stage-ck').forEach((ck, i) => ck.addEventListener('change', () => {
    stageFilters[i] = ck.checked;
    const n = stageFilters.filter(Boolean).length;
    $('#stageFilter').classList.toggle('active', n < 3);
    if (n === 0) drill('empty');
    else if (level === 'empty') drill('segment');
  }));
  $('#rxSearch').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    if (level === 'segment') {
      let shown = 0;
      $$('#segLoanBody tr').forEach(tr => { const match = tr.textContent.toLowerCase().includes(q); tr.style.display = match ? '' : 'none'; if (match) shown++; });
      if (q && shown === 0) drill('empty');
    }
  });
  function clearFilters() { $$('.stage-ck').forEach(ck => ck.checked = true); stageFilters = [true, true, true]; $('#stageFilter').classList.remove('active'); $('#rxSearch').value = ''; drill('segment'); }
  $('#rxClear').addEventListener('click', clearFilters);

  /* ---- PROTO ---- */
  $$('[data-jump]').forEach(b => b.addEventListener('click', () => drill(b.dataset.jump)));

  /* ---- INIT ---- */
  drill('portfolio');
})();
