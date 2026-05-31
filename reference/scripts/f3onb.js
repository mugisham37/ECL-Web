/* ECL — Flow 3 Onboarding wizard · steps, editable tables, invites, validation */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;

  /* ---- THEME ---- */
  function setTheme(t) { root.setAttribute('data-theme', t); $$('[data-theme-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.themeBtn === t)); try { localStorage.setItem('ecl-theme', t); } catch (e) {} }
  $$('[data-theme-btn]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeBtn)));
  try { const st = localStorage.getItem('ecl-theme'); if (st) setTheme(st); else if (matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark'); } catch (e) {}

  /* ---- STATE ---- */
  const STEPS = [
    { key: 'profile', label: 'Profile', n: 'i-building' },
    { key: 'segments', label: 'Segments', n: 'i-layers' },
    { key: 'collateral', label: 'Collateral', n: 'i-shield' },
    { key: 'team', label: 'Team', n: 'i-users' },
    { key: 'review', label: 'Review', n: 'i-clipboard' }
  ];
  const COMMON_SEG = ['Transport', 'Education', 'Agriculture', 'Trade', 'Manufacturing', 'Real Estate', 'Personal', 'SME'];
  const COMMON_COL = [
    ['Cash deposit', 0, 0], ['Government securities', 5, 1], ['Listed equities', 25, 1],
    ['Residential property', 30, 12], ['Commercial property', 40, 18], ['Motor vehicle', 50, 6],
    ['Plant & machinery', 60, 12], ['Personal guarantee', 80, 24]
  ];
  let segments = [];       // {name, code}
  let collateral = [];     // {name, haircut, ttr}
  let invites = [];        // {email, role}
  let cur = 0;             // current step index

  /* ---- SCREEN ROUTER ---- */
  function showScreen(id) { $$('.ob-screen').forEach(s => s.classList.remove('active')); $('#' + id).classList.add('active'); window.scrollTo({ top: 0 }); }
  function gotoStep(i) {
    cur = Math.max(0, Math.min(4, i));
    showScreen('ob-wizard');
    $$('.ob-step').forEach(st => { const on = +st.dataset.step === cur; st.hidden = !on; });
    renderSteps();
    if (cur === 4) renderReview();
    $('#obBack').style.visibility = cur === 0 ? 'hidden' : 'visible';
    $('#obSkip').style.display = (cur === 3) ? 'inline-flex' : (cur === 4 ? 'none' : 'inline-flex');
    $('#obNext').innerHTML = cur === 4 ? 'Finish setup<svg class="ic"><use href="#i-check"/></svg>' : 'Continue<svg class="ic"><use href="#i-arrow-r"/></svg>';
    validate();
    window.scrollTo({ top: 0 });
  }
  function renderSteps() {
    $('#obSteps').innerHTML = STEPS.map((s, i) => {
      const cls = i < cur ? 'done' : i === cur ? 'active' : '';
      const inner = i < cur ? '<svg class="ic"><use href="#i-check"/></svg>' : (i + 1);
      return `<div class="st ${cls}" data-step-jump="${i}"><span class="n">${inner}</span><span class="lbl-txt">${s.label}</span></div>${i < STEPS.length - 1 ? '<span class="line"></span>' : ''}`;
    }).join('');
    $$('#obSteps .st.done').forEach(el => el.addEventListener('click', () => gotoStep(+el.dataset.stepJump)));
  }

  /* ---- SEGMENTS ---- */
  function renderSeg() {
    const has = segments.length > 0;
    $('#segEmpty').hidden = has; $('#segTableWrap').hidden = !has;
    if (has) {
      $('#segBody').innerHTML = segments.map((s, i) => `
        <tr>
          <td><input class="cell-input seg-name" data-i="${i}" value="${esc(s.name)}" placeholder="Segment name"></td>
          <td><input class="cell-input seg-code cell-num" style="width:100%" data-i="${i}" value="${esc(s.code || '')}" placeholder="e.g. TRN"></td>
          <td><button class="row-del" data-del-seg="${i}" aria-label="Remove" ${segments.length <= 1 ? 'disabled' : ''}><svg class="ic ic-14"><use href="#i-trash"/></svg></button></td>
        </tr>`).join('');
      $('#segCount').textContent = segments.length + ' segment' + (segments.length === 1 ? '' : 's');
      bindSeg();
    }
    validate();
  }
  function bindSeg() {
    $$('.seg-name').forEach(inp => inp.addEventListener('input', e => { segments[+e.target.dataset.i].name = e.target.value; checkSegDupes(); validate(); }));
    $$('.seg-code').forEach(inp => inp.addEventListener('input', e => { segments[+e.target.dataset.i].code = e.target.value.toUpperCase(); }));
    $$('[data-del-seg]').forEach(b => b.addEventListener('click', () => { segments.splice(+b.dataset.delSeg, 1); renderSeg(); }));
  }
  function checkSegDupes() {
    const names = segments.map(s => s.name.trim().toLowerCase());
    let dupe = false;
    $$('.seg-name').forEach((inp, i) => {
      const v = inp.value.trim().toLowerCase();
      const isDupe = v && names.indexOf(v) !== i;
      inp.classList.toggle('is-error', isDupe); if (isDupe) dupe = true;
    });
    const err = $('#segErr');
    if (dupe) { err.style.display = 'flex'; err.querySelector('span').textContent = 'Segment names must be unique.'; }
    else err.style.display = 'none';
    return !dupe;
  }

  /* ---- COLLATERAL ---- */
  function renderCol() {
    const has = collateral.length > 0;
    $('#colEmpty').hidden = has; $('#colTableWrap').hidden = !has;
    if (has) {
      $('#colBody').innerHTML = collateral.map((c, i) => `
        <tr>
          <td><input class="cell-input col-name" data-i="${i}" value="${esc(c.name)}" placeholder="Collateral type"></td>
          <td><span class="cell-suffix"><input class="cell-input col-hc cell-num" data-i="${i}" value="${c.haircut}" inputmode="decimal"><span class="sfx">%</span></span></td>
          <td><span class="cell-suffix"><input class="cell-input col-ttr cell-num" data-i="${i}" value="${c.ttr}" inputmode="numeric"><span class="sfx">mo</span></span></td>
          <td><button class="row-del" data-del-col="${i}" aria-label="Remove" ${collateral.length <= 1 ? 'disabled' : ''}><svg class="ic ic-14"><use href="#i-trash"/></svg></button></td>
        </tr>`).join('');
      $('#colCount').textContent = collateral.length + ' type' + (collateral.length === 1 ? '' : 's');
      bindCol();
    }
    validate();
  }
  function bindCol() {
    $$('.col-name').forEach(inp => inp.addEventListener('input', e => { collateral[+e.target.dataset.i].name = e.target.value; checkColValid(); validate(); }));
    $$('.col-hc').forEach(inp => inp.addEventListener('input', e => { collateral[+e.target.dataset.i].haircut = e.target.value; checkColValid(); validate(); }));
    $$('.col-ttr').forEach(inp => inp.addEventListener('input', e => { collateral[+e.target.dataset.i].ttr = e.target.value; checkColValid(); validate(); }));
    $$('[data-del-col]').forEach(b => b.addEventListener('click', () => { collateral.splice(+b.dataset.delCol, 1); renderCol(); }));
  }
  function checkColValid() {
    let bad = false;
    $$('.col-hc').forEach(inp => { const v = parseFloat(inp.value); const e = inp.value !== '' && (isNaN(v) || v < 0 || v > 100); inp.classList.toggle('is-error', e); if (e) bad = true; });
    $$('.col-ttr').forEach(inp => { const v = parseFloat(inp.value); const e = inp.value !== '' && (isNaN(v) || v < 0); inp.classList.toggle('is-error', e); if (e) bad = true; });
    const names = collateral.map(c => c.name.trim().toLowerCase());
    let dupe = false;
    $$('.col-name').forEach((inp, i) => { const v = inp.value.trim().toLowerCase(); const d = v && names.indexOf(v) !== i; inp.classList.toggle('is-error', d); if (d) dupe = true; });
    const err = $('#colErr');
    if (bad) { err.style.display = 'flex'; err.querySelector('span').textContent = 'Haircut must be 0–100%; time to realize must be 0 or more.'; }
    else if (dupe) { err.style.display = 'flex'; err.querySelector('span').textContent = 'Collateral names must be unique.'; }
    else err.style.display = 'none';
    return !bad && !dupe;
  }

  /* ---- INVITES ---- */
  function renderInviteRows() {
    if (!$('#inviteRows').children.length) addInviteRow();
  }
  function addInviteRow(email = '', role = 'Analyst') {
    const div = document.createElement('div'); div.className = 'invite-row';
    div.innerHTML = `<div class="input-wrap"><svg class="ic"><use href="#i-mail"/></svg><input class="input inv-email" type="email" placeholder="name@savannabank.co.ke" value="${esc(email)}"></div>
      <select class="select inv-role"><option ${role === 'Analyst' ? 'selected' : ''}>Analyst</option><option ${role === 'Reviewer' ? 'selected' : ''}>Reviewer</option><option ${role === 'Administrator' ? 'selected' : ''}>Administrator</option></select>
      <button class="row-del" aria-label="Remove row"><svg class="ic ic-14"><use href="#i-trash"/></svg></button>`;
    div.querySelector('.row-del').addEventListener('click', () => { div.remove(); });
    div.querySelector('.inv-email').addEventListener('blur', commitInvites);
    $('#inviteRows').appendChild(div);
  }
  function commitInvites() {
    // Collect valid emails from rows into chips, leave one empty row
    const rows = $$('#inviteRows .invite-row');
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    rows.forEach(row => {
      const em = row.querySelector('.inv-email'); const role = row.querySelector('.inv-role').value;
      const v = em.value.trim();
      if (!v) return;
      if (!re.test(v)) { em.classList.add('is-error'); return; }
      em.classList.remove('is-error');
      if (invites.some(x => x.email.toLowerCase() === v.toLowerCase())) { row.remove(); return; }
      invites.push({ email: v, role }); row.remove();
    });
    renderChips();
    if (!$('#inviteRows').children.length) addInviteRow();
  }
  function renderChips() {
    $('#inviteChips').innerHTML = invites.map((inv, i) => `
      <div class="invite-chip"><span class="avatar avatar-sm">${initials(inv.email)}</span><span class="em">${esc(inv.email)}</span><span class="tag role">${inv.role}</span><button class="row-del" data-del-inv="${i}" aria-label="Remove"><svg class="ic ic-14"><use href="#i-x"/></svg></button></div>`).join('');
    $$('[data-del-inv]').forEach(b => b.addEventListener('click', () => { invites.splice(+b.dataset.delInv, 1); renderChips(); }));
  }

  /* ---- REVIEW ---- */
  function renderReview() {
    const curCode = $('#t-cur').value.slice(0, 3);
    $('#rvProfile').innerHTML = `<div><span class="big">${esc($('#t-name').value)}</span></div>
      <div class="muted" style="margin-top:4px">${$('#t-cur').selectedOptions[0].text} · ${$('#t-tz').value} · ${$('#t-cad').value}</div>`;
    $('#rvSeg').innerHTML = segments.length
      ? `<div class="row-tight wrap" style="gap:6px">${segments.map(s => `<span class="tag">${esc(s.name)}</span>`).join('')}</div><div class="muted t-caption" style="margin-top:6px">${segments.length} segment${segments.length === 1 ? '' : 's'}</div>`
      : `<span class="tag tag-warning">None — required</span>`;
    $('#rvCol').innerHTML = collateral.length
      ? `<div class="muted">${collateral.map(c => `${esc(c.name)} <span class="mono">${c.haircut}%/${c.ttr}mo</span>`).slice(0, 4).join(' · ')}${collateral.length > 4 ? ` <span class="muted">+${collateral.length - 4} more</span>` : ''}</div><div class="muted t-caption" style="margin-top:6px">${collateral.length} type${collateral.length === 1 ? '' : 's'}</div>`
      : `<span class="tag tag-warning">None — required</span>`;
    $('#rvTeam').innerHTML = invites.length
      ? `<div class="row-tight wrap" style="gap:6px">${invites.map(i => `<span class="tag">${esc(i.email)} · ${i.role}</span>`).join('')}</div>`
      : `<span class="muted">No invites — you can add team members later.</span>`;
  }

  /* ---- VALIDATION + GATING ---- */
  function stepValid(i) {
    if (i === 0) return $('#t-name').value.trim().length > 1;
    if (i === 1) return segments.length >= 1 && segments.every(s => s.name.trim()) && checkSegDupes();
    if (i === 2) return collateral.length >= 1 && collateral.every(c => c.name.trim() && c.haircut !== '' && c.ttr !== '') && checkColValid();
    if (i === 3) return true; // optional
    if (i === 4) return segments.length >= 1 && collateral.length >= 1;
    return true;
  }
  function validate() {
    const ok = stepValid(cur);
    const next = $('#obNext'), tip = $('#nextTipBody');
    next.disabled = !ok;
    next.style.opacity = ok ? '1' : '0.5';
    next.style.pointerEvents = ok ? 'auto' : 'none';
    if (!ok) {
      tip.style.display = 'block';
      tip.textContent = cur === 0 ? 'Enter an institution name' : cur === 1 ? 'Add at least one segment' : cur === 2 ? 'Add at least one collateral type' : 'Complete required steps';
    } else tip.style.display = 'none';
  }

  /* ---- NAV BUTTONS ---- */
  $('#obNext').addEventListener('click', () => {
    if ($('#obNext').disabled) return;
    if (cur === 3) commitInvites();
    if (cur < 4) gotoStep(cur + 1);
    else finish();
  });
  $('#obBack').addEventListener('click', () => gotoStep(cur - 1));
  $$('[data-edit]').forEach(b => b.addEventListener('click', () => gotoStep(+b.dataset.edit)));

  /* ---- ADD HANDLERS ---- */
  document.addEventListener('click', e => {
    if (e.target.closest('[data-add-seg]')) { segments.push({ name: '', code: '' }); renderSeg(); setTimeout(() => { const els = $$('.seg-name'); els[els.length - 1] && els[els.length - 1].focus(); }, 30); }
    if (e.target.closest('[data-add-common-seg]')) { COMMON_SEG.forEach(n => { if (!segments.some(s => s.name.toLowerCase() === n.toLowerCase())) segments.push({ name: n, code: n.slice(0, 3).toUpperCase() }); }); renderSeg(); }
    if (e.target.closest('[data-add-col]')) { collateral.push({ name: '', haircut: '', ttr: '' }); renderCol(); setTimeout(() => { const els = $$('.col-name'); els[els.length - 1] && els[els.length - 1].focus(); }, 30); }
    if (e.target.closest('[data-add-common-col]')) { COMMON_COL.forEach(([n, h, t]) => { if (!collateral.some(c => c.name.toLowerCase() === n.toLowerCase())) collateral.push({ name: n, haircut: h, ttr: t }); }); renderCol(); }
    if (e.target.closest('[data-add-invite]')) addInviteRow();
    if (e.target.closest('[data-bulk-add]')) {
      const raw = $('#bulkEmails').value; const re = /[^\s,;]+@[^\s,;]+\.[^\s,;]+/g;
      const found = raw.match(re) || [];
      found.forEach(em => { if (!invites.some(x => x.email.toLowerCase() === em.toLowerCase())) invites.push({ email: em, role: 'Analyst' }); });
      $('#bulkEmails').value = ''; renderChips();
    }
  });

  /* ---- BEGIN / SKIP / FINISH ---- */
  $('[data-begin]').addEventListener('click', () => gotoStep(0));
  $$('[data-skip]').forEach(b => b.addEventListener('click', () => openModal()));

  const scrim = $('#obScrim');
  function openModal() {
    // required variant only blocks at finish; skip is allowed mid-flow
    $('#modalSkip').hidden = false; $('#modalRequired').hidden = true;
    scrim.classList.add('open');
  }
  function openRequired() {
    $('#modalSkip').hidden = true; $('#modalRequired').hidden = false;
    scrim.classList.add('open');
  }
  $$('[data-modal-close]').forEach(b => b.addEventListener('click', () => scrim.classList.remove('open')));
  $$('[data-modal-exit]').forEach(b => b.addEventListener('click', () => { scrim.classList.remove('open'); exitToDash(); }));
  scrim.addEventListener('click', e => { if (e.target === scrim) scrim.classList.remove('open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') scrim.classList.remove('open'); });

  function exitToDash() {
    showScreen('ob-done');
    $('#doneSub').textContent = 'Your progress is saved. You can finish setup anytime from your dashboard.';
    $('.ob-success h1').textContent = 'Saved — pick up later.';
    $('.ob-success .row-tight').innerHTML = '<span class="spinner" style="width:15px;height:15px"></span><span class="t-caption muted">Opening your dashboard…</span>';
  }
  function finish() {
    if (!(segments.length >= 1 && collateral.length >= 1)) { openRequired(); return; }
    const btn = $('#obNext'); btn.innerHTML = '<span class="spinner"></span>Finishing…'; btn.disabled = true;
    setTimeout(() => {
      showScreen('ob-done');
      const n = invites.length;
      $('#doneSub').textContent = n ? `Your workspace is set up. We've emailed ${n} invite${n === 1 ? '' : 's'} to your team.` : 'Your workspace is set up and ready for its first run.';
    }, 1100);
  }

  /* ---- PROTO JUMP ---- */
  $$('[data-jump]').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.jump;
    $$('[data-jump]').forEach(x => x.setAttribute('aria-pressed', x === b));
    if (v === 'welcome') showScreen('ob-welcome');
    else if (v === 'done') { showScreen('ob-done'); $('#doneSub').textContent = 'Your workspace is set up and ready for its first run.'; }
    else {
      // ensure prerequisite data exists so later steps are populated
      if (+v >= 1 && !segments.length) COMMON_SEG.forEach(n => segments.push({ name: n, code: n.slice(0, 3).toUpperCase() }));
      if (+v >= 2 && !collateral.length) COMMON_COL.forEach(([n, h, t]) => collateral.push({ name: n, haircut: h, ttr: t }));
      renderSeg(); renderCol();
      gotoStep(+v);
    }
  }));

  /* ---- HELPERS ---- */
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function initials(em) { const p = em.split('@')[0].split(/[._-]/); return ((p[0]||'')[0] || '' + (p[1] ? p[1][0] : '')).toUpperCase().slice(0, 2) || em[0].toUpperCase(); }

  /* ---- INIT ---- */
  renderInviteRows();
  showScreen('ob-welcome');
})();
