/* ECL — Flow 8 Tenant Admin · sections, members, editable tables, modals, toasts */
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

  /* ---- ROLE VIEW ---- */
  function setRole(r) { root.setAttribute('data-role', r); $$('[data-role-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.roleBtn === r)); $('#roleNote').style.display = r === 'viewer' ? 'flex' : 'none'; }
  $$('[data-role-btn]').forEach(b => b.addEventListener('click', () => setRole(b.dataset.roleBtn)));

  /* ---- SECTION NAV ---- */
  $$('#adminNav a').forEach(a => a.addEventListener('click', () => {
    $$('#adminNav a').forEach(x => x.classList.remove('active')); a.classList.add('active');
    $$('.admin-sec').forEach(s => s.classList.remove('active')); $('#sec-' + a.dataset.sec).classList.add('active');
    window.scrollTo({ top: 0 });
  }));

  /* ---- TOAST ---- */
  function toast(msg, kind) {
    const ic = kind === 'danger' ? 'i-warn' : kind === 'info' ? 'i-info' : 'i-check';
    const col = kind === 'danger' ? 'var(--danger)' : kind === 'info' ? 'var(--accent)' : 'var(--success)';
    const el = document.createElement('div'); el.className = 'toast';
    el.innerHTML = `<svg class="ic" style="color:${col}"><use href="#${ic}"/></svg><span class="grow">${msg}</span><button class="btn btn-icon btn-sm" aria-label="Dismiss"><svg class="ic ic-14"><use href="#i-x"/></svg></button>`;
    $('#toastStack').appendChild(el);
    el.querySelector('button').addEventListener('click', () => el.remove());
    setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3200);
  }

  /* ---- MODAL ---- */
  const scrim = $('#modalScrim'), card = $('#modalCard');
  function modal(html) { card.innerHTML = html; scrim.style.display = 'flex'; $$('[data-mclose]', card).forEach(b => b.addEventListener('click', closeModal)); }
  function closeModal() { scrim.style.display = 'none'; }
  scrim.addEventListener('click', e => { if (e.target === scrim) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeRowPop(); } });

  /* ===== MEMBERS ===== */
  let members = [
    { name: 'Tendai Mwangi', email: 't.mwangi@savannabank.co.ke', init: 'TM', role: 'Admin', status: 'active', last: '2 min ago', you: true },
    { name: 'A. Karanja', email: 'a.karanja@savannabank.co.ke', init: 'AK', role: 'Admin', status: 'active', last: '1 h ago' },
    { name: 'J. Otieno', email: 'j.otieno@savannabank.co.ke', init: 'JO', role: 'Analyst', status: 'active', last: 'Yesterday' },
    { name: 'Grace Wanjiru', email: 'g.wanjiru@savannabank.co.ke', init: 'GW', role: 'Reviewer', status: 'active', last: '3 days ago' },
    { name: 'p.kamau@savannabank.co.ke', email: 'p.kamau@savannabank.co.ke', init: 'PK', role: 'Analyst', status: 'invited', last: 'Invited 2 days ago' }
  ];
  const roleBadge = r => `<span class="role-badge role-${r.toLowerCase()}">${r === 'Admin' ? '<svg class="ic ic-14"><use href="#i-shield"/></svg>' : ''}${r}</span>`;
  const statusPill = s => s === 'active' ? '<span class="pill pill-success"><span class="dot"></span>Active</span>' : s === 'invited' ? '<span class="pill pill-warning"><span class="dot"></span>Invited</span>' : '<span class="pill pill-muted"><span class="dot"></span>Disabled</span>';
  function adminCount() { return members.filter(m => m.role === 'Admin' && m.status === 'active').length; }

  function renderMembers() {
    $('#membersBody').innerHTML = members.map((m, i) => {
      const lastAdmin = m.role === 'Admin' && adminCount() === 1;
      return `<tr class="member-row ${m.status === 'invited' ? 'invited' : ''} ${m.status === 'disabled' ? 'disabled' : ''}">
        <td><div class="member-name"><span class="avatar avatar-sm">${m.init}</span><div class="mn-meta">${m.status === 'invited' ? `<div class="n">${m.email}</div><div class="e">Pending invitation</div>` : `<div class="n">${m.name}${m.you ? ' <span class="t-caption muted">(you)</span>' : ''}</div><div class="e">${m.email}</div>`}</div></div></td>
        <td>${m.status === 'invited' ? roleBadge(m.role) : `<select class="role-select admin-editable" data-role-sel="${i}" ${lastAdmin ? 'disabled title="The last Admin cannot be demoted"' : ''}><option ${m.role === 'Admin' ? 'selected' : ''}>Admin</option><option ${m.role === 'Analyst' ? 'selected' : ''}>Analyst</option><option ${m.role === 'Reviewer' ? 'selected' : ''}>Reviewer</option></select>`}</td>
        <td>${statusPill(m.status)}</td>
        <td class="muted t-caption">${m.last}</td>
        <td><div style="position:relative;text-align:right"><button class="row-menu-btn admin-editable" data-mrow="${i}" aria-label="Member actions"><svg class="ic ic-14"><use href="#i-dots"/></svg></button></div></td>
      </tr>`;
    }).join('');
    $('[data-sec="members"] .badge') && ($('[data-sec="members"] .badge').textContent = members.length);
    // role change
    $$('[data-role-sel]').forEach(sel => sel.addEventListener('change', e => {
      const i = +e.target.dataset.roleSel, newRole = e.target.value, m = members[i];
      if (m.role === 'Admin' && newRole !== 'Admin' && adminCount() === 1) { e.target.value = 'Admin'; toast("Can't demote the last Admin.", 'danger'); return; }
      modal(`<h3 class="t-h2" style="font-size:var(--fs-h2)">Change role to ${newRole}?</h3><p class="muted" style="margin-top:8px">${m.name} will ${newRole === 'Admin' ? 'gain full admin access to settings and members' : newRole === 'Analyst' ? 'be able to upload files and run ECLs' : 'be able to read results only'}.</p><div class="row-tight" style="margin-top:20px;gap:10px"><button class="btn btn-secondary grow" data-mclose data-revert="${i}">Cancel</button><button class="btn btn-primary grow" data-confirm-role="${i}" data-nr="${newRole}">Change role</button></div>`);
      $('[data-revert]', card).addEventListener('click', () => renderMembers());
      $('[data-confirm-role]', card).addEventListener('click', () => { m.role = newRole; closeModal(); renderMembers(); toast(`${m.name} is now ${newRole}.`); });
    }));
    // row menu
    $$('[data-mrow]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); openRowMenu(b, +b.dataset.mrow); }));
  }

  let rowPop = null;
  function closeRowPop() { if (rowPop) { rowPop.remove(); rowPop = null; } }
  function openRowMenu(btn, i) {
    closeRowPop();
    const m = members[i];
    const items = [];
    if (m.status === 'invited') { items.push(['i-refresh', 'Resend invite', () => toast('Invite resent to ' + m.email, 'info')]); items.push(['i-x', 'Revoke invite', () => { members.splice(i, 1); renderMembers(); toast('Invite revoked.', 'info'); }, true]); }
    else {
      const lastAdmin = m.role === 'Admin' && adminCount() === 1;
      if (m.status === 'active') items.push(['i-ban', 'Disable access', () => { if (lastAdmin) { toast("Can't disable the last Admin.", 'danger'); return; } m.status = 'disabled'; renderMembers(); toast(m.name + ' disabled.', 'info'); }]);
      else items.push(['i-check', 'Re-enable access', () => { m.status = 'active'; renderMembers(); toast(m.name + ' re-enabled.'); }]);
      items.push(['i-trash', 'Remove from workspace', () => { if (lastAdmin) { toast("Can't remove the last Admin.", 'danger'); return; } confirmRemove(i); }, true]);
    }
    const pop = document.createElement('div'); pop.className = 'row-pop';
    pop.innerHTML = items.map((it, k) => `<button class="${it[3] ? 'danger' : ''}" data-it="${k}"><svg class="ic"><use href="#${it[0]}"/></svg>${it[1]}</button>`).join('');
    btn.parentNode.appendChild(pop);
    const r = btn.getBoundingClientRect();
    pop.style.top = '34px'; pop.style.right = '0';
    items.forEach((it, k) => pop.querySelector(`[data-it="${k}"]`).addEventListener('click', () => { closeRowPop(); it[2](); }));
    rowPop = pop;
  }
  document.addEventListener('click', e => { if (rowPop && !e.target.closest('.row-pop') && !e.target.closest('[data-mrow]')) closeRowPop(); });

  function confirmRemove(i) {
    const m = members[i];
    modal(`<div class="auth-icon warn" style="width:44px;height:44px;border-radius:12px;background:var(--danger-subtle);color:var(--danger);display:grid;place-items:center;margin-bottom:14px"><svg class="ic ic-20"><use href="#i-trash"/></svg></div><h3 class="t-h2" style="font-size:var(--fs-h2)">Remove ${m.name}?</h3><p class="muted" style="margin-top:8px">They'll immediately lose access to Savanna Bank. Runs they created stay in the audit trail.</p><div class="row-tight" style="margin-top:20px;gap:10px"><button class="btn btn-secondary grow" data-mclose>Cancel</button><button class="btn btn-danger grow" id="doRemove">Remove member</button></div>`);
    $('#doRemove').addEventListener('click', () => { members.splice(i, 1); closeModal(); renderMembers(); toast(m.name + ' removed.', 'info'); });
  }

  /* invite */
  $('#inviteBtn').addEventListener('click', () => {
    modal(`<h3 class="t-h2" style="font-size:var(--fs-h2)">Invite a member</h3><p class="muted" style="margin-top:6px">They'll get an email link to set a password and join.</p>
      <div class="col" style="gap:14px;margin-top:18px">
        <div class="field"><label for="invEmail">Work email</label><div class="input-wrap"><svg class="ic"><use href="#i-mail"/></svg><input class="input" id="invEmail" type="email" placeholder="name@savannabank.co.ke"></div><span class="err" id="invErr" style="display:none"><svg class="ic ic-14"><use href="#i-warn"/></svg>Enter a valid email.</span></div>
        <div class="field"><label for="invRole">Role</label><select class="select" id="invRole"><option>Analyst</option><option>Reviewer</option><option>Admin</option></select></div>
      </div>
      <div class="row-tight" style="margin-top:20px;gap:10px"><button class="btn btn-secondary grow" data-mclose>Cancel</button><button class="btn btn-primary grow" id="doInvite"><svg class="ic ic-14"><use href="#i-mail"/></svg>Send invite</button></div>`);
    $('#doInvite').addEventListener('click', () => {
      const email = $('#invEmail').value.trim(), role = $('#invRole').value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $('#invErr').style.display = 'flex'; $('#invEmail').classList.add('is-error'); return; }
      members.push({ name: email, email, init: email.slice(0, 2).toUpperCase(), role, status: 'invited', last: 'Invited just now' });
      closeModal(); renderMembers(); toast('Invite sent to ' + email + '.');
    });
  });

  /* ===== SEGMENTS ===== */
  let segments = [
    { name: 'Transport', code: 'TRN', runs: 8, disabled: false },
    { name: 'Agriculture', code: 'AGR', runs: 8, disabled: false },
    { name: 'Trade', code: 'TRD', runs: 8, disabled: false },
    { name: 'Manufacturing', code: 'MFG', runs: 6, disabled: false },
    { name: 'Real Estate', code: 'RES', runs: 6, disabled: false },
    { name: 'Education', code: 'EDU', runs: 8, disabled: false },
    { name: 'SME', code: 'SME', runs: 4, disabled: false }
  ];
  const COMMON_SEG = ['Transport', 'Education', 'Agriculture', 'Trade', 'Manufacturing', 'Real Estate', 'Personal', 'SME'];
  function renderSeg() {
    $('#segBody').innerHTML = segments.map((s, i) => `
      <tr ${s.disabled ? 'style="opacity:.55"' : ''}>
        <td><input class="cell-input seg-name" data-i="${i}" value="${esc(s.name)}" style="max-width:240px"></td>
        <td><input class="cell-input seg-code" data-i="${i}" value="${esc(s.code)}" style="width:90px;text-transform:uppercase"></td>
        <td class="num"><span class="usage-chip">${s.runs ? s.runs + ' runs' : 'unused'}</span></td>
        <td>${s.disabled ? '<span class="pill pill-muted"><span class="dot"></span>Disabled</span>' : '<span class="pill pill-success"><span class="dot"></span>Active</span>'}</td>
        <td><button class="row-del" data-seg-menu="${i}" aria-label="Segment actions"><svg class="ic ic-14"><use href="#i-dots"/></svg></button></td>
      </tr>`).join('');
    $('[data-sec="segments"] .badge') && ($('[data-sec="segments"] .badge').textContent = segments.filter(s => !s.disabled).length);
    $$('.seg-name').forEach(inp => inp.addEventListener('input', e => { segments[+e.target.dataset.i].name = e.target.value; markDirty('segments'); }));
    $$('.seg-code').forEach(inp => inp.addEventListener('input', e => { segments[+e.target.dataset.i].code = e.target.value.toUpperCase(); markDirty('segments'); }));
    $$('[data-seg-menu]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); openSegMenu(b, +b.dataset.segMenu); }));
  }
  function openSegMenu(btn, i) {
    closeRowPop(); const s = segments[i];
    const pop = document.createElement('div'); pop.className = 'row-pop';
    const items = [];
    items.push([s.disabled ? 'i-check' : 'i-ban', s.disabled ? 'Enable for new runs' : 'Disable for new runs', () => { s.disabled = !s.disabled; renderSeg(); toast(`${s.name} ${s.disabled ? 'disabled' : 'enabled'} for new runs.`, 'info'); }]);
    items.push(['i-trash', 'Delete segment', () => deleteSeg(i), true]);
    pop.innerHTML = items.map((it, k) => `<button class="${it[2 + 1] ? 'danger' : ''}" data-it="${k}"><svg class="ic"><use href="#${it[0]}"/></svg>${it[1]}</button>`).join('');
    btn.parentNode.style.position = 'relative'; btn.parentNode.appendChild(pop); pop.style.top = '32px'; pop.style.right = '0';
    items.forEach((it, k) => pop.querySelector(`[data-it="${k}"]`).addEventListener('click', () => { closeRowPop(); it[2](); }));
    rowPop = pop;
  }
  function deleteSeg(i) {
    const s = segments[i];
    if (s.runs > 0) {
      modal(`<div class="auth-icon warn" style="width:44px;height:44px;border-radius:12px;background:var(--warning-subtle);color:var(--warning);display:grid;place-items:center;margin-bottom:14px"><svg class="ic ic-20"><use href="#i-warn"/></svg></div><h3 class="t-h2" style="font-size:var(--fs-h2)">"${s.name}" is used in ${s.runs} runs</h3><p class="muted" style="margin-top:8px">Deleting it would break those runs' history. Disable it instead — it stays out of new runs but keeps past results intact.</p><div class="col" style="gap:10px;margin-top:20px"><button class="btn btn-primary" id="disableInstead"><svg class="ic ic-14"><use href="#i-ban"/></svg>Disable for new runs</button><button class="btn btn-ghost" data-mclose>Keep segment</button></div>`);
      $('#disableInstead').addEventListener('click', () => { s.disabled = true; closeModal(); renderSeg(); toast(`${s.name} disabled for new runs.`, 'info'); });
    } else {
      modal(`<h3 class="t-h2" style="font-size:var(--fs-h2)">Delete "${s.name}"?</h3><p class="muted" style="margin-top:8px">This segment hasn't been used in any run, so it's safe to delete.</p><div class="row-tight" style="margin-top:20px;gap:10px"><button class="btn btn-secondary grow" data-mclose>Cancel</button><button class="btn btn-danger grow" id="doDelSeg">Delete</button></div>`);
      $('#doDelSeg').addEventListener('click', () => { segments.splice(i, 1); closeModal(); renderSeg(); toast(`${s.name} deleted.`, 'info'); });
    }
  }
  $('#addSegBtn').addEventListener('click', () => { segments.push({ name: '', code: '', runs: 0, disabled: false }); renderSeg(); markDirty('segments'); setTimeout(() => { const e = $$('.seg-name'); e[e.length - 1] && e[e.length - 1].focus(); }, 20); });
  $('[data-add-common-seg]').addEventListener('click', () => { COMMON_SEG.forEach(n => { if (!segments.some(s => s.name.toLowerCase() === n.toLowerCase())) segments.push({ name: n, code: n.slice(0, 3).toUpperCase(), runs: 0, disabled: false }); }); renderSeg(); markDirty('segments'); });

  /* ===== COLLATERAL ===== */
  let collateral = [
    { name: 'Cash deposit', hc: 0, ttr: 0 }, { name: 'Government securities', hc: 5, ttr: 1 },
    { name: 'Listed equities', hc: 25, ttr: 1 }, { name: 'Residential property', hc: 30, ttr: 12 },
    { name: 'Commercial property', hc: 40, ttr: 18 }, { name: 'Motor vehicle', hc: 50, ttr: 6 },
    { name: 'Plant & machinery', hc: 60, ttr: 12 }, { name: 'Personal guarantee', hc: 80, ttr: 24 }
  ];
  const COMMON_COL = [['Cash deposit', 0, 0], ['Government securities', 5, 1], ['Listed equities', 25, 1], ['Residential property', 30, 12], ['Commercial property', 40, 18], ['Motor vehicle', 50, 6], ['Plant & machinery', 60, 12], ['Personal guarantee', 80, 24]];
  function renderCol() {
    $('#colBody').innerHTML = collateral.map((c, i) => `
      <tr>
        <td style="padding-left:16px"><input class="cell-input col-name" data-i="${i}" value="${esc(c.name)}" style="max-width:260px"></td>
        <td><span class="cell-suffix"><input class="cell-input col-hc cell-num" data-i="${i}" value="${c.hc}" inputmode="decimal"><span class="sfx">%</span></span></td>
        <td><span class="cell-suffix"><input class="cell-input col-ttr cell-num" data-i="${i}" value="${c.ttr}" inputmode="numeric"><span class="sfx">mo</span></span></td>
        <td><button class="row-del" data-del-col="${i}" aria-label="Delete"><svg class="ic ic-14"><use href="#i-trash"/></svg></button></td>
      </tr>`).join('');
    $('[data-sec="collateral"] .badge') && ($('[data-sec="collateral"] .badge').textContent = collateral.length);
    $$('.col-name').forEach(inp => inp.addEventListener('input', e => { collateral[+e.target.dataset.i].name = e.target.value; markDirty('collateral'); checkCol(); }));
    $$('.col-hc').forEach(inp => inp.addEventListener('input', e => { collateral[+e.target.dataset.i].hc = e.target.value; markDirty('collateral'); checkCol(); }));
    $$('.col-ttr').forEach(inp => inp.addEventListener('input', e => { collateral[+e.target.dataset.i].ttr = e.target.value; markDirty('collateral'); checkCol(); }));
    $$('[data-del-col]').forEach(b => b.addEventListener('click', () => {
      const i = +b.dataset.delCol, c = collateral[i];
      modal(`<h3 class="t-h2" style="font-size:var(--fs-h2)">Delete "${c.name}"?</h3><p class="muted" style="margin-top:8px">Loans referencing this collateral type in future uploads will fail validation until it's re-added. Past runs are unaffected.</p><div class="row-tight" style="margin-top:20px;gap:10px"><button class="btn btn-secondary grow" data-mclose>Cancel</button><button class="btn btn-danger grow" id="doDelCol">Delete type</button></div>`);
      $('#doDelCol').addEventListener('click', () => { collateral.splice(i, 1); closeModal(); renderCol(); toast(`${c.name} deleted.`, 'info'); });
    }));
  }
  function checkCol() {
    let bad = false;
    $$('.col-hc').forEach(inp => { const v = parseFloat(inp.value); const e = inp.value !== '' && (isNaN(v) || v < 0 || v > 100); inp.classList.toggle('is-error', e); if (e) bad = true; });
    $$('.col-ttr').forEach(inp => { const v = parseFloat(inp.value); const e = inp.value !== '' && (isNaN(v) || v < 0); inp.classList.toggle('is-error', e); if (e) bad = true; });
    const err = $('#colErr');
    if (bad) { err.style.display = 'flex'; err.querySelector('span').textContent = 'Haircut must be 0–100%; time to realize must be 0 or more.'; }
    else err.style.display = 'none';
    return !bad;
  }
  $('#addColBtn').addEventListener('click', () => { collateral.push({ name: '', hc: '', ttr: '' }); renderCol(); markDirty('collateral'); setTimeout(() => { const e = $$('.col-name'); e[e.length - 1] && e[e.length - 1].focus(); }, 20); });
  $('[data-add-common-col]').addEventListener('click', () => { COMMON_COL.forEach(([n, h, t]) => { if (!collateral.some(c => c.name.toLowerCase() === n.toLowerCase())) collateral.push({ name: n, hc: h, ttr: t }); }); renderCol(); markDirty('collateral'); });

  /* ===== SAVE BAR (dirty state) ===== */
  let dirty = null;
  function markDirty(sec) {
    if (dirty === sec) return; dirty = sec;
    $('#saveBarSlot').innerHTML = `<div style="position:fixed;left:0;right:0;bottom:0;z-index:70;padding:0 var(--gutter) 16px;display:flex;justify-content:center;pointer-events:none"><div class="save-bar" style="pointer-events:auto;max-width:760px;width:100%"><span class="sb-msg"><svg class="ic ic-14" style="color:var(--warning)"><use href="#i-info"/></svg>You have unsaved changes in ${sec}.</span><div class="row-tight"><button class="btn btn-ghost" id="sbCancel">Discard</button><button class="btn btn-primary" id="sbSave"><svg class="ic ic-14"><use href="#i-check"/></svg>Save changes</button></div></div></div>`;
    $('#sbSave').addEventListener('click', () => { clearDirty(); toast('Changes saved. They apply to future runs.'); });
    $('#sbCancel').addEventListener('click', () => { clearDirty(); toast('Changes discarded.', 'info'); if (dirtySec === 'segments') renderSeg(); });
  }
  let dirtySec = null;
  function clearDirty() { dirty = null; $('#saveBarSlot').innerHTML = ''; }

  /* profile + danger */
  ['p-name', 'p-cadence'].forEach(id => { const el = $('#' + id); el && el.addEventListener('input', () => markDirty('tenant profile')); el && el.addEventListener('change', () => markDirty('tenant profile')); });
  $('#closeTenantBtn').addEventListener('click', () => {
    modal(`<div class="auth-icon warn" style="width:44px;height:44px;border-radius:12px;background:var(--danger-subtle);color:var(--danger);display:grid;place-items:center;margin-bottom:14px"><svg class="ic ic-20"><use href="#i-ban"/></svg></div><h3 class="t-h2" style="font-size:var(--fs-h2)">Request tenant closure</h3><p class="muted" style="margin-top:8px">This sends a closure request to a Super Admin. Runs and audit records are retained for 7 years. Type <strong>CLOSE</strong> to confirm.</p><input class="input" id="closeConfirm" placeholder="Type CLOSE" style="margin-top:14px"><div class="row-tight" style="margin-top:18px;gap:10px"><button class="btn btn-secondary grow" data-mclose>Cancel</button><button class="btn btn-danger grow" id="doClose" disabled style="opacity:.5">Request closure</button></div>`);
    $('#closeConfirm').addEventListener('input', e => { const ok = e.target.value === 'CLOSE'; $('#doClose').disabled = !ok; $('#doClose').style.opacity = ok ? '1' : '.5'; });
    $('#doClose').addEventListener('click', () => { closeModal(); toast('Closure request sent to Super Admin.', 'info'); });
  });

  /* ---- HELPERS ---- */
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  /* ---- INIT ---- */
  renderMembers(); renderSeg(); renderCol();
})();
