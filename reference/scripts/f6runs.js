/* ECL — Flow 6 Run List + Detail · filter, nav, tabs, variants, audit */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const app = $('#app');

  /* ---- THEME + SHELL ---- */
  function setTheme(t) { root.setAttribute('data-theme', t); $$('[data-theme-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.themeBtn === t)); try { localStorage.setItem('ecl-theme', t); } catch (e) {} if (curDetail) renderDetailCharts(); }
  $$('[data-theme-btn]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeBtn)));
  try { const st = localStorage.getItem('ecl-theme'); if (st) setTheme(st); else if (matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark'); } catch (e) {}
  $('#collapseBtn').addEventListener('click', () => { app.dataset.side = app.dataset.side === 'collapsed' ? 'expanded' : 'collapsed'; });
  $('#menuBtn').addEventListener('click', () => { app.dataset.side = 'open'; $('#sideScrim').classList.add('open'); });
  $('#sideScrim').addEventListener('click', () => { app.dataset.side = 'expanded'; $('#sideScrim').classList.remove('open'); });

  /* ===== DATA ===== */
  const KES = n => Math.abs(n).toLocaleString('en-US');
  const RUNS = [
    { id: 'c81a…77fe', name: 'May 2026', period: 'May 2026', created: '30 May 14:22', by: 'TM', byName: 'Tendai Mwangi', status: 'success', ecl: 1284500, cov: '2.41%' },
    { id: 'b40d…91a2', name: 'Apr 2026', period: 'Apr 2026', created: '30 Apr 09:14', by: 'AK', byName: 'A. Karanja', status: 'success', ecl: 1232040, cov: '2.39%' },
    { id: '7f2e…03cc', name: 'Apr 2026 (rerun)', period: 'Apr 2026', created: '28 Apr 16:40', by: 'JO', byName: 'J. Otieno', status: 'failed', ecl: null, cov: '—' },
    { id: 'a155…7b91', name: 'May 2026 (draft)', period: 'May 2026', created: '30 May 13:58', by: 'TM', byName: 'Tendai Mwangi', status: 'running', ecl: null, cov: '—' },
    { id: 'e918…5b6d', name: 'Mar 2026', period: 'Mar 2026', created: '31 Mar 11:02', by: 'TM', byName: 'Tendai Mwangi', status: 'success', ecl: 1201880, cov: '2.36%' },
    { id: '3c7d…12ff', name: 'Feb 2026', period: 'Feb 2026', created: '28 Feb 10:31', by: 'AK', byName: 'A. Karanja', status: 'success', ecl: 1188300, cov: '2.34%' },
    { id: 'd204…aa18', name: 'Jan 2026', period: 'Jan 2026', created: '31 Jan 15:47', by: 'JO', byName: 'J. Otieno', status: 'success', ecl: 1164220, cov: '2.31%' },
    { id: '9b81…6e2c', name: 'Dec 2025 (draft)', period: 'Dec 2025', created: '02 Jan 08:20', by: 'TM', byName: 'Tendai Mwangi', status: 'draft', ecl: null, cov: '—' }
  ];
  function pill(status) {
    if (status === 'success') return '<span class="pill pill-success"><svg class="ic ic-14"><use href="#i-check"/></svg>Complete</span>';
    if (status === 'failed') return '<span class="pill pill-danger"><svg class="ic ic-14"><use href="#i-x"/></svg>Failed</span>';
    if (status === 'running') return '<span class="pill pill-running"><span class="dot"></span>Running</span>';
    return '<span class="pill pill-neutral"><span class="dot"></span>Draft</span>';
  }

  /* ===== LIST ===== */
  let filterStatus = 'all', search = '';
  function renderList() {
    const rows = RUNS.filter(r => (filterStatus === 'all' || r.status === filterStatus) && (!search || (r.id + r.period + r.name).toLowerCase().includes(search.toLowerCase())));
    const body = $('#listBody');
    if (!rows.length) { $('.list-table-wrap').style.display = 'none'; $('#listEmpty').style.display = 'block'; }
    else {
      $('.list-table-wrap').style.display = 'block'; $('#listEmpty').style.display = 'none';
      body.innerHTML = rows.map(r => `
        <tr data-run="${r.id}">
          <td><span class="run-id-cell">${r.id}<svg class="ic ic-14"><use href="#i-copy"/></svg></span></td>
          <td>${r.period}</td>
          <td class="num" style="text-align:left;color:var(--text-muted)">${r.created}</td>
          <td><span class="by-mini"><span class="avatar avatar-sm">${r.by}</span><span class="muted t-caption">${r.byName}</span></span></td>
          <td>${pill(r.status)}</td>
          <td class="num">${r.ecl == null ? '<span class="amount zero">—</span>' : `<span class="amount">${KES(r.ecl)}</span>`}</td>
          <td class="num">${r.cov}</td>
          <td><span class="row-actions"><button class="btn btn-icon btn-sm" aria-label="View" data-open="${r.id}"><svg class="ic ic-14"><use href="#i-eye"/></svg></button><button class="btn btn-icon btn-sm" aria-label="More"><svg class="ic ic-14"><use href="#i-dots"/></svg></button></span></td>
        </tr>`).join('');
      $$('#listBody tr').forEach(tr => tr.addEventListener('click', e => { if (e.target.closest('[aria-label="More"]')) return; openDetail(detailStateFor(tr.dataset.run)); }));
    }
    $('#listFoot').textContent = `Showing ${rows.length} of ${RUNS.length}`;
    $('#listCount').textContent = RUNS.length + ' runs';
  }
  function detailStateFor(id) {
    const r = RUNS.find(x => x.id === id);
    if (!r) return 'complete';
    return r.status === 'failed' ? 'failed' : r.status === 'running' ? 'running' : 'complete';
  }
  $('#searchInput').addEventListener('input', e => { search = e.target.value; renderList(); });
  $$('#statusSeg button').forEach(b => b.addEventListener('click', () => { filterStatus = b.dataset.status; $$('#statusSeg button').forEach(x => x.setAttribute('aria-pressed', x === b)); renderList(); }));
  $('#clearFilters').addEventListener('click', () => { filterStatus = 'all'; search = ''; $('#searchInput').value = ''; $$('#statusSeg button').forEach(x => x.setAttribute('aria-pressed', x.dataset.status === 'all')); renderList(); });

  /* ===== VIEW SWITCH ===== */
  function showView(v) { $$('.f6-view').forEach(x => x.classList.remove('active')); $('#view-' + v).classList.add('active'); window.scrollTo({ top: 0 }); }
  $$('[data-back]').forEach(b => b.addEventListener('click', () => { curDetail = null; showView('list'); $$('[data-view],[data-detail]').forEach(x => x.setAttribute('aria-pressed', x.dataset.view === 'list')); }));
  $$('[data-newrun]').forEach(b => b.addEventListener('click', () => alert('→ Flow 5 · New Run wizard')));

  /* ===== DETAIL ===== */
  let curDetail = null;
  function openDetail(state) {
    curDetail = state; showView('detail');
    const banner = $('#detailBanner'), status = $('#dStatus'), meta = $('#dMeta'), actions = $('#dActions'), tabs = $('#dTabs');
    banner.innerHTML = ''; tabs.style.display = 'flex';
    $$('.detail-tab').forEach(t => t.style.display = 'flex');

    if (state === 'complete') {
      $('#dRunName').textContent = 'May 2026';
      status.innerHTML = '<span class="pill pill-success"><svg class="ic ic-14"><use href="#i-check"/></svg>Complete</span>';
      meta.innerHTML = `<span>Computed 30 May 2026 · 14:22 UTC</span><span class="dot"></span><span class="by-mini"><span class="avatar avatar-sm">TM</span>Tendai Mwangi</span><span class="dot"></span><span>elapsed 38s</span>`;
      actions.innerHTML = `<button class="btn btn-secondary"><svg class="ic ic-14"><use href="#i-download"/></svg>Download</button><button class="btn btn-primary"><svg class="ic ic-14"><use href="#i-eye"/></svg>View results</button><button class="btn btn-icon" id="moreBtn" aria-label="More"><svg class="ic"><use href="#i-dots"/></svg></button>`;
      renderKpis(false); switchTab('overview');
    } else if (state === 'running') {
      $('#dRunName').textContent = 'May 2026 (draft)';
      status.innerHTML = '<span class="pill pill-running"><span class="dot"></span>Running</span>';
      meta.innerHTML = `<span>Started 30 May 2026 · 13:58 UTC</span><span class="dot"></span><span class="by-mini"><span class="avatar avatar-sm">TM</span>Tendai Mwangi</span>`;
      actions.innerHTML = `<button class="btn btn-secondary">Cancel run</button>`;
      banner.innerHTML = `<div class="detail-banner running"><span class="spinner" style="width:18px;height:18px"></span><span class="grow"><strong>Computing…</strong> LGD engine · 1,247 loans · <span class="mono">45%</span></span><div style="width:200px"><div class="progress"><div class="bar" style="width:45%"></div></div></div></div>`;
      renderKpis(true); // dimmed/pending
      // limit tabs: only inputs + audit available while running
      $$('.detail-tab').forEach(t => { if (t.dataset.tab === 'overview' || t.dataset.tab === 'engine') t.style.display = 'none'; });
      switchTab('inputs');
    } else if (state === 'failed') {
      $('#dRunName').textContent = 'Apr 2026 (rerun)';
      status.innerHTML = '<span class="pill pill-danger"><svg class="ic ic-14"><use href="#i-x"/></svg>Failed</span>';
      meta.innerHTML = `<span>Failed 28 Apr 2026 · 16:41 UTC</span><span class="dot"></span><span class="by-mini"><span class="avatar avatar-sm">JO</span>J. Otieno</span><span class="dot"></span><span>at LGD stage</span>`;
      actions.innerHTML = `<button class="btn btn-secondary"><svg class="ic ic-14"><use href="#i-refresh"/></svg>Edit &amp; retry</button><button class="btn btn-icon" id="moreBtn" aria-label="More"><svg class="ic"><use href="#i-dots"/></svg></button>`;
      banner.innerHTML = `<div class="detail-banner failed"><svg class="ic"><use href="#i-warn"/></svg><span class="grow"><strong>Failed at the LGD stage:</strong> unknown collateral type "Warehouse receipt" (LGD_collateral_05.xlsx, row 412). No partial results were saved. <span class="mono t-caption">ref a3f9-2c1b</span></span></div>`;
      renderKpis(true);
      $$('.detail-tab').forEach(t => { if (t.dataset.tab === 'overview') t.style.display = 'none'; });
      switchTab('audit');
    } else if (state === 'deleted') {
      $('#dRunName').textContent = 'Jan 2026';
      status.innerHTML = '<span class="pill pill-muted"><span class="dot"></span>Soft-deleted</span>';
      meta.innerHTML = `<span>Computed 31 Jan 2026 · 15:47 UTC</span><span class="dot"></span><span class="by-mini"><span class="avatar avatar-sm">JO</span>J. Otieno</span>`;
      actions.innerHTML = `<button class="btn btn-secondary" id="restoreBtn"><svg class="ic ic-14"><use href="#i-restore"/></svg>Restore run</button>`;
      banner.innerHTML = `<div class="detail-banner deleted"><svg class="ic"><use href="#i-trash"/></svg><span class="grow">This run was soft-deleted by <strong>A. Karanja</strong> on 5 May 2026. It's retained for audit and can be restored.</span></div>`;
      renderKpis(false); switchTab('overview');
      setTimeout(() => { const rb = $('#restoreBtn'); rb && rb.addEventListener('click', () => openModal('restore')); }, 0);
    }
    wireMore();
    renderAudit(state);
    renderDetailCharts();
    $$('[data-view],[data-detail]').forEach(x => x.setAttribute('aria-pressed', x.dataset.detail === state));
  }

  function renderKpis(pending) {
    const data = pending
      ? [['Total ECL', 'KES', '—'], ['Coverage', '', '—'], ['Outstanding', 'KES', '—'], ['Loans', '', '—']]
      : [['Total ECL', 'KES', '1,284,500'], ['Coverage ratio', '', '2.41%'], ['Total outstanding', 'KES', '57.4M'], ['Loans analysed', '', '11,847']];
    $('#dKpis').innerHTML = data.map(([l, c, v]) => `<div class="kpi${pending ? ' locked' : ''}"><span class="label">${l}</span><span class="value">${c ? `<span class="cur">${c}</span>` : ''}${v}</span></div>`).join('');
  }

  /* ---- TABS ---- */
  function switchTab(name) {
    $$('.detail-tab').forEach(t => t.setAttribute('aria-selected', t.dataset.tab === name));
    $$('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + name));
    if (name === 'overview') renderDetailCharts();
  }
  $$('.detail-tab').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

  /* ---- AUDIT TIMELINE ---- */
  function renderAudit(state) {
    const base = [
      { cls: 'accent', ic: 'i-plus', t: 'Run created', d: 'Draft initialised', who: 'Tendai Mwangi', time: '13:58:02' },
      { cls: '', ic: 'i-upload', t: 'Files uploaded', d: 'PD_loans_2026-05.xlsx <span class="mono">a3f9…2c1b</span>, PD_branch4.xlsx <span class="mono">7d10…b8e4</span>, LGD_collateral_05.xlsx <span class="mono">c81a…77fe</span>, EAD_balances_05.xlsx <span class="mono">e918…5b6d</span>', who: 'Tendai Mwangi', time: '14:18:30' },
      { cls: 'ok', ic: 'i-check', t: 'Validation passed', d: '3 files valid · 3 warnings accepted on PD_branch4.xlsx', who: 'Tendai Mwangi', time: '14:21:05' },
      { cls: 'accent', ic: 'i-zap', t: 'Computation started', d: 'Engine v1.0.3', who: 'system', time: '14:21:40' }
    ];
    let events;
    if (state === 'failed') {
      events = [
        { cls: 'accent', ic: 'i-plus', t: 'Run created', d: 'Draft initialised', who: 'J. Otieno', time: '16:30:11' },
        { cls: '', ic: 'i-upload', t: 'Files uploaded', d: '3 inputs · LGD_collateral_05.xlsx <span class="mono">c81a…77fe</span>', who: 'J. Otieno', time: '16:38:02' },
        { cls: 'ok', ic: 'i-check', t: 'Validation passed', d: 'All files valid', who: 'J. Otieno', time: '16:40:15' },
        { cls: 'accent', ic: 'i-zap', t: 'Computation started', d: 'Engine v1.0.3', who: 'system', time: '16:40:50' },
        { cls: 'ok', ic: 'i-check', t: 'PD engine completed', d: '6 segments · 4.1s', who: 'system', time: '16:40:54' },
        { cls: 'err', ic: 'i-x', t: 'Run failed at LGD stage', d: 'Unknown collateral type "Warehouse receipt" · row 412 · <span class="mono">ref a3f9-2c1b</span>', who: 'system', time: '16:41:09' }
      ];
    } else if (state === 'running') {
      events = base.concat([{ cls: 'ok', ic: 'i-check', t: 'PD engine completed', d: '6 segments · 4.1s', who: 'system', time: '14:21:44' }, { cls: 'accent', ic: 'i-clock', t: 'LGD engine running…', d: '1,247 loans · in progress', who: 'system', time: '14:21:44' }]);
    } else {
      events = base.concat([
        { cls: 'ok', ic: 'i-check', t: 'PD engine completed', d: '6 segments · 299 powers · 4.1s', who: 'system', time: '14:21:44' },
        { cls: 'ok', ic: 'i-check', t: 'LGD engine completed', d: '1,247 loans · 18.7s', who: 'system', time: '14:22:03' },
        { cls: 'ok', ic: 'i-check', t: 'EAD &amp; ECL completed', d: 'Total ECL KES 1,284,500', who: 'system', time: '14:22:18' },
        { cls: 'ok', ic: 'i-check', t: 'Run completed', d: 'Outputs saved · elapsed 38s', who: 'system', time: '14:22:18' }
      ]);
      if (state === 'deleted') events.push({ cls: '', ic: 'i-trash', t: 'Run soft-deleted', d: 'Retained for audit', who: 'A. Karanja', time: '5 May 09:12' });
      else events.push({ cls: '', ic: 'i-download', t: 'Workbooks downloaded', d: 'PD, LGD, EAD, ECL workbooks', who: 'Tendai Mwangi', time: '14:25:40' });
    }
    $('#auditTimeline').innerHTML = events.map(e => `
      <div class="audit-ev ${e.cls}"><div class="ae-dot"><svg class="ic ic-14"><use href="#${e.ic}"/></svg></div>
        <div class="ae-body"><div class="between" style="align-items:flex-start"><div class="ae-t">${e.t}</div><span class="ae-time">${e.time}</span></div>
          <div class="ae-d">${e.d}</div>
          <div class="ae-meta"><span class="avatar avatar-sm" style="width:18px;height:18px;font-size:9px">${e.who === 'system' ? '<svg class="ic ic-14" style="width:11px;height:11px"><use href="#i-cpu"/></svg>' : e.who.split(' ').map(p => p[0]).join('').slice(0, 2)}</span><span class="t-caption muted">${e.who}</span></div>
        </div></div>`).join('');
  }

  /* ---- DETAIL CHARTS ---- */
  function renderDetailCharts() {
    const host = $('#dBar'); if (!host) return;
    const bars = [['Transport', 318], ['Agriculture', 264], ['Trade', 212], ['Manufacturing', 178], ['Real Estate', 143], ['Education', 88]];
    const max = 320;
    host.innerHTML = `<svg viewBox="0 0 440 ${bars.length * 28}" width="100%" role="img" aria-label="ECL by segment">${bars.map(([n, v], i) => { const y = i * 28, bw = (v / max) * 270; return `<text x="0" y="${y + 18}" font-size="12" fill="var(--text-muted)" font-family="var(--font-ui)">${n}</text><rect x="112" y="${y + 6}" width="${bw}" height="15" rx="3" fill="var(--chart-1)"/><text x="${112 + bw + 8}" y="${y + 18}" font-size="12" fill="var(--text)" font-family="var(--font-mono)">${v}k</text>`; }).join('')}</svg>`;
  }

  /* ---- MORE MENU + MODALS ---- */
  function wireMore() {
    const mb = $('#moreBtn'); if (!mb) return;
    mb.addEventListener('click', e => { e.stopPropagation(); openModal('more'); });
  }
  const scrim = $('#modalScrim'), card = $('#modalCard');
  function openModal(kind) {
    if (kind === 'more') {
      card.innerHTML = `<h3 class="t-h2" style="font-size:var(--fs-h2)">Run actions</h3>
        <div class="col" style="gap:4px;margin-top:14px">
          <button class="mp-item" style="border:1px solid var(--border)" data-act="rerun"><svg class="ic"><use href="#i-refresh"/></svg>Re-run with same inputs</button>
          <button class="mp-item" style="border:1px solid var(--border)"><svg class="ic"><use href="#i-download"/></svg>Download workbooks</button>
          <button class="mp-item danger" style="border:1px solid var(--border)" data-act="delete"><svg class="ic"><use href="#i-trash"/></svg>Soft-delete run</button>
        </div>
        <button class="btn btn-ghost" data-mclose style="width:100%;margin-top:12px">Close</button>`;
    } else if (kind === 'delete') {
      card.innerHTML = `<div class="auth-icon warn" style="width:44px;height:44px;border-radius:12px;background:var(--warning-subtle);color:var(--warning);display:grid;place-items:center;margin-bottom:14px"><svg class="ic ic-20"><use href="#i-trash"/></svg></div>
        <h3 class="t-h2" style="font-size:var(--fs-h2)">Soft-delete this run?</h3>
        <p class="muted" style="margin-top:8px">The run is hidden from lists but retained for 7 years for audit. You can restore it anytime.</p>
        <div class="row-tight" style="margin-top:20px;gap:10px"><button class="btn btn-secondary grow" data-mclose>Cancel</button><button class="btn btn-danger grow" data-mclose>Soft-delete</button></div>`;
    } else if (kind === 'rerun') {
      card.innerHTML = `<div class="auth-icon info" style="width:44px;height:44px;border-radius:12px;background:var(--accent-subtle);color:var(--accent);display:grid;place-items:center;margin-bottom:14px"><svg class="ic ic-20"><use href="#i-refresh"/></svg></div>
        <h3 class="t-h2" style="font-size:var(--fs-h2)">Re-run with the same inputs?</h3>
        <p class="muted" style="margin-top:8px">A new run will be created using the identical input hashes on engine v1.0.3. The result should be byte-identical — this verifies reproducibility.</p>
        <div class="row-tight" style="margin-top:20px;gap:10px"><button class="btn btn-secondary grow" data-mclose>Cancel</button><button class="btn btn-primary grow" data-mclose>Start re-run</button></div>`;
    } else if (kind === 'restore') {
      card.innerHTML = `<div class="auth-icon info" style="width:44px;height:44px;border-radius:12px;background:var(--accent-subtle);color:var(--accent);display:grid;place-items:center;margin-bottom:14px"><svg class="ic ic-20"><use href="#i-restore"/></svg></div>
        <h3 class="t-h2" style="font-size:var(--fs-h2)">Restore this run?</h3>
        <p class="muted" style="margin-top:8px">It will reappear in the runs list and results. The audit trail records the restore.</p>
        <div class="row-tight" style="margin-top:20px;gap:10px"><button class="btn btn-secondary grow" data-mclose>Cancel</button><button class="btn btn-primary grow" data-mclose>Restore run</button></div>`;
    }
    scrim.style.display = 'flex';
    $$('[data-mclose]', card).forEach(b => b.addEventListener('click', () => scrim.style.display = 'none'));
    $$('[data-act]', card).forEach(b => b.addEventListener('click', () => { const a = b.dataset.act; scrim.style.display = 'none'; setTimeout(() => openModal(a), 80); }));
  }
  scrim.addEventListener('click', e => { if (e.target === scrim) scrim.style.display = 'none'; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') scrim.style.display = 'none'; });

  /* ---- PROTO ---- */
  $$('[data-view]').forEach(b => b.addEventListener('click', () => { curDetail = null; showView('list'); $$('[data-view],[data-detail]').forEach(x => x.setAttribute('aria-pressed', x === b)); }));
  $$('[data-detail]').forEach(b => b.addEventListener('click', () => openDetail(b.dataset.detail)));

  /* ---- COPY ---- */
  document.addEventListener('click', e => { const c = e.target.closest('[data-copy]'); if (c) { const t = $('#dHash').textContent; navigator.clipboard && navigator.clipboard.writeText(t).catch(() => {}); } });

  /* ---- INIT ---- */
  renderList();
})();
