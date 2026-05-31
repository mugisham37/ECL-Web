/* ECL — Flow 10 Super Admin · tenants, health, engine, audit, operator actions */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const app = $('#app');

  /* ---- THEME + SHELL ---- */
  function setTheme(t) { root.setAttribute('data-theme', t); $$('[data-theme-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.themeBtn === t)); try { localStorage.setItem('ecl-theme', t); } catch (e) {} renderCharts(); }
  $$('[data-theme-btn]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeBtn)));
  try { const st = localStorage.getItem('ecl-theme'); if (st) setTheme(st); else if (matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark'); } catch (e) {}
  $('#collapseBtn').addEventListener('click', () => { app.dataset.side = app.dataset.side === 'collapsed' ? 'expanded' : 'collapsed'; });
  $('#menuBtn').addEventListener('click', () => { app.dataset.side = 'open'; $('#sideScrim').classList.add('open'); });
  $('#sideScrim').addEventListener('click', () => { app.dataset.side = 'expanded'; $('#sideScrim').classList.remove('open'); });

  /* ---- TOAST + MODAL ---- */
  function toast(msg, kind) {
    const ic = kind === 'danger' ? 'i-alert' : kind === 'info' ? 'i-info' : 'i-check';
    const col = kind === 'danger' ? 'var(--danger)' : kind === 'info' ? 'var(--accent)' : 'var(--success)';
    const el = document.createElement('div'); el.className = 'toast';
    el.innerHTML = `<svg class="ic" style="color:${col}"><use href="#${ic}"/></svg><span class="grow">${msg}</span><button class="btn btn-icon btn-sm" aria-label="Dismiss"><svg class="ic ic-14"><use href="#i-x"/></svg></button>`;
    $('#toastStack').appendChild(el); el.querySelector('button').addEventListener('click', () => el.remove());
    setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3200);
  }
  const scrim = $('#modalScrim'), card = $('#modalCard');
  function modal(html) { card.innerHTML = html; scrim.style.display = 'flex'; $$('[data-mclose]', card).forEach(b => b.addEventListener('click', () => scrim.style.display = 'none')); }
  scrim.addEventListener('click', e => { if (e.target === scrim) scrim.style.display = 'none'; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { scrim.style.display = 'none'; closeDrawer(); } });

  /* ---- SECTION NAV ---- */
  function goto(sec) {
    $$('.op-sec').forEach(s => s.classList.toggle('active', s.id === 'op-' + sec));
    $$('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === sec));
    $$('[data-jump]').forEach(b => b.setAttribute('aria-pressed', b.dataset.jump === sec));
    if (innerWidth < 768) { app.dataset.side = 'expanded'; $('#sideScrim').classList.remove('open'); }
    window.scrollTo({ top: 0 });
    if (sec === 'overview') renderCharts();
  }
  $$('[data-nav]').forEach(a => a.addEventListener('click', () => goto(a.dataset.nav)));
  $$('[data-jump]').forEach(b => b.addEventListener('click', () => goto(b.dataset.jump)));

  /* ===== DATA ===== */
  const TENANTS = [
    { name: 'Savanna Bank PLC', mark: 'SB', color: 'var(--accent)', plan: 'Growth', status: 'active', users: 14, runs: 8, created: 'Jan 2026', mrr: 3500 },
    { name: 'Acacia MFI', mark: 'AC', color: '#D79320', plan: 'Starter', status: 'active', users: 5, runs: 4, created: 'Feb 2026', mrr: 1200 },
    { name: 'Rift Valley Trust', mark: 'RV', color: '#2BB6C9', plan: 'Enterprise', status: 'active', users: 38, runs: 22, created: 'Nov 2025', mrr: 9800 },
    { name: 'Karibu Finance', mark: 'KF', color: '#6D4AFF', plan: 'Growth', status: 'trial', users: 7, runs: 2, created: 'May 2026', mrr: 0 },
    { name: 'Baobab Credit', mark: 'BC', color: '#2C9A63', plan: 'Starter', status: 'active', users: 4, runs: 3, created: 'Mar 2026', mrr: 1200 },
    { name: 'Meridian Bank', mark: 'MB', color: '#B364C9', plan: 'Enterprise', status: 'active', users: 51, runs: 31, created: 'Aug 2025', mrr: 12500 },
    { name: 'Tumaini SACCO', mark: 'TS', color: '#DD6A52', plan: 'Starter', status: 'trial', users: 3, runs: 1, created: 'May 2026', mrr: 0 },
    { name: 'Zahara Microbank', mark: 'ZM', color: '#4F7FE0', plan: 'Growth', status: 'suspended', users: 9, runs: 0, created: 'Dec 2025', mrr: 0 }
  ];
  const USERS = [
    ['Tendai Mwangi', 't.mwangi@savannabank.co.ke', 'Savanna Bank PLC', 'Admin', 'active', '2 min ago'],
    ['A. Karanja', 'a.karanja@savannabank.co.ke', 'Savanna Bank PLC', 'Admin', 'active', '1 h ago'],
    ['Fatuma Said', 'f.said@rvtrust.co.ke', 'Rift Valley Trust', 'Analyst', 'active', '20 min ago'],
    ['Daniel Kim', 'd.kim@meridian.com', 'Meridian Bank', 'Reviewer', 'active', '3 h ago'],
    ['P. Njoroge', 'p.njoroge@acacia.co.ke', 'Acacia MFI', 'Admin', 'disabled', '12 days ago'],
    ['Grace Wanjiru', 'g.wanjiru@savannabank.co.ke', 'Savanna Bank PLC', 'Reviewer', 'active', '3 days ago']
  ];

  const KES = n => n.toLocaleString('en-US');
  function planTag(p) { return `<span class="plan-tag plan-${p.toLowerCase()}">${p}</span>`; }
  function statusPill(s) { return s === 'active' ? '<span class="pill pill-success"><span class="dot"></span>Active</span>' : s === 'trial' ? '<span class="pill pill-warning"><span class="dot"></span>Trial</span>' : '<span class="pill pill-danger"><span class="dot"></span>Suspended</span>'; }

  /* ===== TENANTS LIST ===== */
  let tFilter = 'all', tSearch = '';
  function renderTenants() {
    const rows = TENANTS.filter(t => (tFilter === 'all' || t.status === tFilter) && (!tSearch || t.name.toLowerCase().includes(tSearch.toLowerCase())));
    $('#tenantsBody').innerHTML = rows.map((t, i) => `
      <tr data-tenant="${TENANTS.indexOf(t)}">
        <td><div class="tenant-name-cell"><span class="tn-mark" style="background:color-mix(in srgb, ${t.color} 16%, transparent);color:${t.color}">${t.mark}</span><span style="font-weight:var(--fw-medium)">${t.name}</span></div></td>
        <td>${planTag(t.plan)}</td>
        <td>${statusPill(t.status)}</td>
        <td class="num">${t.users}</td>
        <td class="num">${t.runs}</td>
        <td class="muted">${t.created}</td>
        <td class="num mrr-cell">${t.mrr ? '$' + KES(t.mrr) : '—'}</td>
        <td class="num"><svg class="ic ic-14 subtle"><use href="#i-chev-r"/></svg></td>
      </tr>`).join('');
    $$('#tenantsBody tr').forEach(tr => tr.addEventListener('click', () => openDrawer(+tr.dataset.tenant)));
    $('#tenantFoot').textContent = rows.length + ' of ' + TENANTS.length + ' tenants';
    $('#tenantCount').textContent = TENANTS.length + ' tenants';
  }
  $('#tenantSearch').addEventListener('input', e => { tSearch = e.target.value; renderTenants(); });
  $$('#tenantStatusSeg button').forEach(b => b.addEventListener('click', () => { tFilter = b.dataset.tstatus; $$('#tenantStatusSeg button').forEach(x => x.setAttribute('aria-pressed', x === b)); renderTenants(); }));

  /* ===== TENANT DRAWER ===== */
  const drawer = $('#tenantDrawer'), drawerScrim = $('#drawerScrim');
  function closeDrawer() { drawer.classList.remove('open'); drawerScrim.classList.remove('open'); }
  drawerScrim.addEventListener('click', closeDrawer);
  function openDrawer(i) {
    const t = TENANTS[i];
    drawer.innerHTML = `
      <div class="drawer-head">
        <div class="row-tight"><span class="tn-mark" style="width:36px;height:36px;border-radius:9px;background:color-mix(in srgb, ${t.color} 16%, transparent);color:${t.color};font-size:13px">${t.mark}</span><div><div style="font-weight:var(--fw-semibold);font-size:var(--fs-h3)">${t.name}</div><div class="t-caption muted">${planTag(t.plan)} · created ${t.created}</div></div></div>
        <button class="btn btn-icon" data-drawer-close aria-label="Close"><svg class="ic"><use href="#i-x"/></svg></button>
      </div>
      <div class="drawer-body">
        <div style="margin-bottom:16px">${statusPill(t.status)}</div>
        <div class="drawer-stat">
          <div class="ds"><div class="k">Users</div><div class="v">${t.users}</div></div>
          <div class="ds"><div class="k">Runs this month</div><div class="v">${t.runs}</div></div>
          <div class="ds"><div class="k">MRR</div><div class="v">${t.mrr ? '$' + KES(t.mrr) : '—'}</div></div>
          <div class="ds"><div class="k">Engine pin</div><div class="v" style="font-size:.9rem">v1.0.3 <span class="t-caption muted">(default)</span></div></div>
        </div>
        <div class="t-micro" style="margin-bottom:8px">Tenant admins</div>
        <div class="col" style="gap:8px;margin-bottom:18px">
          <div class="row-tight"><span class="avatar avatar-sm">TM</span><div><div class="t-body" style="font-weight:500">Tendai Mwangi</div><div class="t-caption muted">t.mwangi@${t.name.split(' ')[0].toLowerCase()}.co.ke</div></div></div>
          <div class="row-tight"><span class="avatar avatar-sm">AK</span><div><div class="t-body" style="font-weight:500">A. Karanja</div><div class="t-caption muted">a.karanja@${t.name.split(' ')[0].toLowerCase()}.co.ke</div></div></div>
        </div>
        <div class="callout callout-info"><svg class="ic"><use href="#i-info"/></svg><span>${t.status === 'trial' ? 'Trial ends in 9 days. Extend or convert to a paid plan.' : t.status === 'suspended' ? 'Suspended for non-payment on 12 May. Data retained per policy.' : 'Healthy. Last run 30 May 2026.'}</span></div>
      </div>
      <div class="drawer-foot">
        <button class="btn btn-secondary" data-impersonate="${i}"><svg class="ic ic-14"><use href="#i-mask"/></svg>Impersonate</button>
        ${t.status === 'trial' ? '<button class="btn btn-secondary" data-extend="' + i + '">Extend trial</button>' : ''}
        ${t.status === 'suspended' ? '<button class="btn btn-primary" data-reactivate="' + i + '"><svg class="ic ic-14"><use href="#i-check"/></svg>Reactivate</button>' : '<button class="btn btn-danger" data-suspend="' + i + '"><svg class="ic ic-14"><use href="#i-ban"/></svg>Suspend</button>'}
      </div>`;
    drawer.classList.add('open'); drawerScrim.classList.add('open');
    $('[data-drawer-close]', drawer).addEventListener('click', closeDrawer);
    const imp = $('[data-impersonate]', drawer); if (imp) imp.addEventListener('click', () => impersonate(i));
    const sus = $('[data-suspend]', drawer); if (sus) sus.addEventListener('click', () => suspend(i));
    const react = $('[data-reactivate]', drawer); if (react) react.addEventListener('click', () => { TENANTS[i].status = 'active'; closeDrawer(); renderTenants(); toast(t.name + ' reactivated.'); });
    const ext = $('[data-extend]', drawer); if (ext) ext.addEventListener('click', () => { closeDrawer(); toast('Trial for ' + t.name + ' extended 14 days.', 'info'); });
  }
  function impersonate(i) {
    const t = TENANTS[i];
    modal(`<div class="danger-modal-ic" style="background:var(--warning-subtle);color:var(--warning)"><svg class="ic ic-20"><use href="#i-mask"/></svg></div>
      <h3 class="t-h2" style="font-size:var(--fs-h2)">Impersonate ${t.name}?</h3>
      <p class="muted" style="margin-top:8px">You'll see their workspace exactly as their admin does. This is logged to the platform audit trail with your operator ID, and a persistent banner will show you're impersonating. You can't start runs or change billing.</p>
      <div class="row-tight" style="margin-top:20px;gap:10px"><button class="btn btn-secondary grow" data-mclose>Cancel</button><button class="btn btn-primary grow" id="doImp"><svg class="ic ic-14"><use href="#i-mask"/></svg>Start session</button></div>`);
    $('#doImp').addEventListener('click', () => { scrim.style.display = 'none'; closeDrawer(); toast('Impersonation session started for ' + t.name + '. Logged to audit.', 'info'); });
  }
  function suspend(i) {
    const t = TENANTS[i];
    modal(`<div class="danger-modal-ic" style="background:var(--danger-subtle);color:var(--danger)"><svg class="ic ic-20"><use href="#i-ban"/></svg></div>
      <h3 class="t-h2" style="font-size:var(--fs-h2)">Suspend ${t.name}?</h3>
      <p class="muted" style="margin-top:8px">All ${t.users} users lose access immediately. Runs and data are retained per the 7-year audit policy and can be restored on reactivation. Type <strong>SUSPEND</strong> to confirm.</p>
      <input class="input" id="suspConfirm" placeholder="Type SUSPEND" style="margin-top:14px">
      <div class="row-tight" style="margin-top:18px;gap:10px"><button class="btn btn-secondary grow" data-mclose>Cancel</button><button class="btn btn-danger grow" id="doSusp" disabled style="opacity:.5">Suspend tenant</button></div>`);
    $('#suspConfirm').addEventListener('input', e => { const ok = e.target.value === 'SUSPEND'; $('#doSusp').disabled = !ok; $('#doSusp').style.opacity = ok ? '1' : '.5'; });
    $('#doSusp').addEventListener('click', () => { TENANTS[i].status = 'suspended'; TENANTS[i].mrr = 0; scrim.style.display = 'none'; closeDrawer(); renderTenants(); toast(t.name + ' suspended.', 'danger'); });
  }

  /* ===== PROVISION ===== */
  function provision() {
    modal(`<h3 class="t-h2" style="font-size:var(--fs-h2)">Provision a new tenant</h3><p class="muted" style="margin-top:6px">Creates an isolated workspace and emails the first admin a setup link.</p>
      <div class="col" style="gap:14px;margin-top:18px">
        <div class="field"><label for="pvName">Institution name</label><div class="input-wrap"><svg class="ic"><use href="#i-building"/></svg><input class="input" id="pvName" placeholder="e.g. Coastline Bank"></div></div>
        <div class="row" style="gap:12px"><div class="field grow"><label for="pvPlan">Plan</label><select class="select" id="pvPlan"><option>Starter</option><option selected>Growth</option><option>Enterprise</option></select></div>
        <div class="field grow"><label for="pvRegion">Region</label><select class="select" id="pvRegion"><option>af-east-1 (Nairobi)</option><option>af-west-1 (Lagos)</option><option>eu-west-1 (Dublin)</option></select></div></div>
        <div class="field"><label for="pvEmail">First admin email</label><div class="input-wrap"><svg class="ic"><use href="#i-mail"/></svg><input class="input" id="pvEmail" type="email" placeholder="admin@bank.com"></div></div>
        <label class="check"><input type="checkbox" id="pvTrial" checked><span class="box"><svg viewBox="0 0 24 24"><use href="#i-check"/></svg></span>Start with a 14-day trial</label>
      </div>
      <div class="row-tight" style="margin-top:20px;gap:10px"><button class="btn btn-secondary grow" data-mclose>Cancel</button><button class="btn btn-primary grow" id="doProvision"><svg class="ic ic-14"><use href="#i-rocket"/></svg>Provision</button></div>`);
    $('#doProvision').addEventListener('click', () => {
      const name = $('#pvName').value.trim() || 'New Tenant', plan = $('#pvPlan').value, trial = $('#pvTrial').checked;
      TENANTS.unshift({ name, mark: name.slice(0, 2).toUpperCase(), color: '#2BB6C9', plan, status: trial ? 'trial' : 'active', users: 1, runs: 0, created: 'May 2026', mrr: trial ? 0 : (plan === 'Starter' ? 1200 : plan === 'Growth' ? 3500 : 9800) });
      scrim.style.display = 'none'; goto('tenants'); renderTenants(); toast(name + ' provisioned. Setup link emailed.');
    });
  }
  $('#provisionBtn').addEventListener('click', provision);
  $('#provisionTop').addEventListener('click', provision);

  /* ===== USERS ===== */
  function renderUsers() {
    $('#usersBody').innerHTML = USERS.map(([name, email, tenant, role, status, last]) => `
      <tr>
        <td><div class="row-tight"><span class="avatar avatar-sm">${name.split(' ').map(p => p[0]).join('').slice(0, 2)}</span><div><div class="t-body" style="font-weight:500">${name}</div><div class="t-caption muted">${email}</div></div></div></td>
        <td class="muted">${tenant}</td>
        <td><span class="role-badge role-${role.toLowerCase()}">${role === 'Admin' ? '<svg class="ic ic-14"><use href="#i-check"/></svg>' : ''}${role}</span></td>
        <td>${status === 'active' ? '<span class="pill pill-success"><span class="dot"></span>Active</span>' : '<span class="pill pill-muted"><span class="dot"></span>Disabled</span>'}</td>
        <td class="muted t-caption">${last}</td>
        <td><button class="row-menu-btn" aria-label="User actions"><svg class="ic ic-14"><use href="#i-dots"/></svg></button></td>
      </tr>`).join('');
  }

  /* ===== HEALTH ===== */
  let degraded = false;
  const SERVICES = [
    { name: 'API gateway', ic: 'i-globe', val: '142ms p95' },
    { name: 'Engine workers', ic: 'i-cpu', val: '8 / 12 busy' },
    { name: 'Object storage', ic: 'i-server', val: '1.2 TB' },
    { name: 'Email delivery', ic: 'i-mail', val: '99.9% sent' }
  ];
  function renderHealth() {
    $('#healthGrid').innerHTML = SERVICES.map((s, i) => {
      const state = (degraded && i === 1) ? 'down' : (degraded && i === 0) ? 'warn' : 'ok';
      const label = state === 'down' ? 'Outage' : state === 'warn' ? 'Degraded' : 'Operational';
      return `<div class="health-card ${state}"><span class="hc-led"></span><div class="hc-meta"><div class="t">${s.name}</div><div class="d">${label}</div></div><span class="hc-val">${state === 'down' ? 'unreachable' : s.val}</span></div>`;
    }).join('');
    $('#healthSub').innerHTML = degraded ? '<span style="color:var(--danger)">Engine workers degraded — runs are queuing</span>' : '<span>All systems operational</span>';
    $('#uptimeTag').style.display = degraded ? 'none' : 'inline-flex';
    $('#queueSub').textContent = degraded ? '3 running · 27 queued · avg wait 4m 30s' : '8 running · 3 queued · avg wait 12s';
    const run = degraded ? 3 : 8, queue = degraded ? 14 : 3, total = 22;
    $('#queueBar').innerHTML = Array.from({ length: total }, (_, i) => `<span class="qb ${i < run ? 'run' : i < run + queue ? 'queue' : ''}"></span>`).join('');
    const errs = degraded
      ? [['err', 'i-alert', 'Engine worker pool unresponsive', '3 workers failed health check · auto-scaling triggered', 'just now'],
         ['err', 'i-warn', 'Run queue backing up', '27 runs queued across 6 tenants', '2 min ago'],
         ['', 'i-x', 'Run failed · Meridian Bank', 'Worker timeout · auto-retry scheduled', '4 min ago']]
      : [['', 'i-warn', 'Validation rejected · Acacia MFI', 'Unknown collateral type in upload', '38 min ago'],
         ['', 'i-x', 'Run failed · Rift Valley Trust', 'Unmapped segment · tenant notified', '2 h ago']];
    $('#healthErrors').innerHTML = errs.map(([cls, ic, t, d, time]) => `<div class="audit-ev ${cls}"><div class="ae-dot"><svg class="ic ic-14"><use href="#${ic}"/></svg></div><div class="ae-body"><div class="between" style="align-items:flex-start"><div class="ae-t">${t}</div><span class="ae-time">${time}</span></div><div class="ae-d">${d}</div></div></div>`).join('');
    $('#errCount').textContent = degraded ? '3 active · last 1h' : 'Last 24h';
  }
  $('[data-degrade]').addEventListener('click', () => { degraded = !degraded; renderHealth(); renderDegradeBanner(); goto('health'); $('[data-degrade]').setAttribute('aria-pressed', degraded); });
  function renderDegradeBanner() {
    $('#degradeBanner').innerHTML = degraded ? `<div class="dash-banner failed" style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:var(--r-md);margin-bottom:var(--sp-5);background:var(--danger-subtle)"><svg class="ic" style="color:var(--danger)"><use href="#i-warn"/></svg><span class="grow"><strong>Platform incident:</strong> engine worker pool degraded. Runs are queuing across tenants. Auto-scaling in progress.</span><button class="btn btn-secondary btn-sm" data-nav-health>View health</button></div>` : '';
    const b = $('[data-nav-health]'); if (b) b.addEventListener('click', () => goto('health'));
  }

  /* ===== ENGINE ===== */
  const ENGINES = [
    { v: 'v1.0.3', date: '2 Apr 2026', current: true, tenants: 22, log: ['Stable cure-rate calculation for sparse segments', 'Faster matrix exponentiation (299 powers)', 'Deterministic float summation order'] },
    { v: 'v1.0.2', date: '11 Feb 2026', current: false, tenants: 2, log: ['Collateral proportioning fix for multi-loan customers', 'EAD rundown edge case at maturity'] },
    { v: 'v1.0.1', date: '3 Jan 2026', current: false, tenants: 0, log: ['Initial GA release'] }
  ];
  function renderEngine() {
    $('#engineList').innerHTML = ENGINES.map((e, i) => `
      <div class="engine-card ${e.current ? 'current' : ''}">
        <div class="engine-row-head">
          <span class="ev">${e.v}</span>
          ${e.current ? '<span class="pill pill-success"><svg class="ic ic-14"><use href="#i-check"/></svg>Default</span>' : ''}
          <div class="meta"><div class="t-caption muted">Released ${e.date} · ${e.tenants} tenant${e.tenants === 1 ? '' : 's'} pinned</div></div>
          ${e.current ? '' : `<button class="btn btn-secondary btn-sm" data-promote="${i}"><svg class="ic ic-14"><use href="#i-up"/></svg>Promote to default</button>`}
        </div>
        <div class="engine-changelog"><ul>${e.log.map(l => `<li><svg class="ic ic-14"><use href="#i-check"/></svg>${l}</li>`).join('')}</ul></div>
      </div>`).join('');
    $$('[data-promote]').forEach(b => b.addEventListener('click', () => {
      const i = +b.dataset.promote, e = ENGINES[i];
      modal(`<div class="danger-modal-ic" style="background:var(--warning-subtle);color:var(--warning)"><svg class="ic ic-20"><use href="#i-up"/></svg></div><h3 class="t-h2" style="font-size:var(--fs-h2)">Promote ${e.v} to default?</h3><p class="muted" style="margin-top:8px">New runs across all unpinned tenants will use ${e.v}. <strong>Past runs are never altered</strong> — they keep the version they were computed with, so determinism holds.</p><div class="row-tight" style="margin-top:20px;gap:10px"><button class="btn btn-secondary grow" data-mclose>Cancel</button><button class="btn btn-primary grow" id="doPromote">Promote</button></div>`);
      $('#doPromote').addEventListener('click', () => { ENGINES.forEach(x => x.current = false); ENGINES[i].current = true; scrim.style.display = 'none'; renderEngine(); toast(e.v + ' promoted to default.'); });
    }));
  }

  /* ===== AUDIT ===== */
  const AUDIT = [
    { cls: 'accent', ic: 'i-rocket', t: 'Tenant provisioned', d: 'Karibu Finance · Growth · 14-day trial', who: 'operator: j.ops', time: '30 May 11:20' },
    { cls: 'err', ic: 'i-ban', t: 'Tenant suspended', d: 'Zahara Microbank · non-payment', who: 'operator: a.billing', time: '28 May 09:05' },
    { cls: 'accent', ic: 'i-mask', t: 'Impersonation started', d: 'Rift Valley Trust · support ticket #4821', who: 'operator: s.support', time: '27 May 14:32' },
    { cls: '', ic: 'i-mask', t: 'Impersonation ended', d: 'Rift Valley Trust · 11 min session', who: 'operator: s.support', time: '27 May 14:43' },
    { cls: 'ok', ic: 'i-cpu', t: 'Engine promoted to default', d: 'v1.0.3 · 22 tenants affected', who: 'operator: j.ops', time: '2 Apr 10:00' },
    { cls: '', ic: 'i-users', t: 'User force-reset', d: 'p.njoroge@acacia.co.ke · lost device', who: 'operator: s.support', time: '18 Apr 16:11' }
  ];
  function renderAudit(host, items) {
    $(host).innerHTML = items.map(e => `
      <div class="audit-ev ${e.cls}"><div class="ae-dot"><svg class="ic ic-14"><use href="#${e.ic}"/></svg></div>
        <div class="ae-body"><div class="between" style="align-items:flex-start"><div class="ae-t">${e.t}</div><span class="ae-time">${e.time}</span></div>
          <div class="ae-d">${e.d}</div>
          <div class="ae-meta" style="display:flex;align-items:center;gap:8px;margin-top:6px"><span class="hash" style="cursor:default">${e.who}</span></div>
        </div></div>`).join('');
  }

  /* ===== CHARTS ===== */
  function renderCharts() {
    const tr = $('#ovTrend');
    if (tr) {
      const pts = [120, 135, 128, 142, 155, 138, 90, 95, 160, 148, 152, 144, 158, 147];
      const W = 640, H = 180, pad = 24, min = 80, max = 170;
      const xy = pts.map((v, i) => [pad + (i / (pts.length - 1)) * (W - pad * 2), H - pad - ((v - min) / (max - min)) * (H - pad * 2)]);
      const path = xy.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
      tr.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Runs across platform">
        ${[0, 1, 2, 3].map(i => `<line x1="${pad}" x2="${W - pad}" y1="${(pad + i * (H - pad * 2) / 3).toFixed(0)}" y2="${(pad + i * (H - pad * 2) / 3).toFixed(0)}" stroke="var(--border)"/>`).join('')}
        <path d="${path}" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
        ${xy.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2" fill="var(--accent)"/>`).join('')}</svg>`;
    }
    const pl = $('#ovPlans');
    if (pl) {
      const data = [['Starter', 9, 'var(--text-subtle)'], ['Growth', 10, 'var(--accent)'], ['Enterprise', 5, '#B364C9']];
      let off = 0, C = 2 * Math.PI * 50, total = 24;
      const arcs = data.map(([n, v, c]) => { const len = (v / total) * C, el = `<circle cx="68" cy="68" r="50" fill="none" stroke="${c}" stroke-width="15" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-off}" transform="rotate(-90 68 68)"/>`; off += len; return el; }).join('');
      pl.innerHTML = `<svg viewBox="0 0 136 136" width="120" height="120">${arcs}<text x="68" y="64" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Tenants</text><text x="68" y="82" text-anchor="middle" font-size="17" fill="var(--text)" font-family="var(--font-mono)" font-weight="500">24</text></svg>
        <div class="legend" style="display:flex;flex-direction:column;gap:9px">${data.map(([n, v, c]) => `<div class="lg" style="display:flex;align-items:center;gap:9px;font-size:var(--fs-body)"><span style="width:10px;height:10px;border-radius:2px;background:${c}"></span><span style="width:84px">${n}</span><span class="mono t-caption muted">${v}</span></div>`).join('')}</div>`;
    }
  }

  /* ---- INIT ---- */
  renderTenants(); renderUsers(); renderHealth(); renderEngine();
  renderAudit('#platformAudit', AUDIT); renderAudit('#ovActivity', AUDIT.slice(0, 4));
  renderCharts();
})();
