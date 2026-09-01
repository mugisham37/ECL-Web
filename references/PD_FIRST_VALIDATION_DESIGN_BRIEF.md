# PD-First Validation — Design Brief for `/design`

**How to use this document:** this is the prompt. Hand it to Claude Design (`/design`) as-is, or paste its content as the command's arguments. It is written to be self-contained — everything needed to execute is either stated here verbatim or pointed to by exact file path, so no context needs to be re-derived from conversation history.

---

## 1. Mission

Design the new **PD-first validation** screens for Flow 5 (the New Run wizard) of the ECL Platform. Today, `ECL-Web/references/Flow 5 - New Run.html` bundles PD, LGD, and EAD into one combined upload → validate step that returns a vague pass/fail banner. The functional spec at `../PD_VALIDATION_REDESIGN.md` (one directory up from `references/`, i.e. the ECL workspace root) already defines *what* has to change: PD gets uploaded and validated **on its own**, immediately, with a real criteria checklist (not a checkmark), a sortable/searchable loan-level table showing a computed **Next Month Staging** column, and a per-segment **transition matrix** preview — all before LGD, EAD, Confirm, or Compute are touched. Read that document first; it is the source of truth for *what* to design. This brief is the source of truth for *how it should look* and *how to execute the work*.

This is a design task, not a build task — the output is new/updated static HTML+CSS mockups in the same style as the existing `references/` set, not application code.

---

## 2. Execution Instructions — Multi-Agent Orchestration

Before drafting a single artboard, decompose the work across coordinated agents rather than doing it in one linear pass. Use this structure:

- **Lead/Overview agent** — owns the mission end-to-end, holds this brief and the functional spec in context throughout, resolves conflicts between what the other agents produce, and is the one that actually drafts/edits the `/design` canvas artboards once the inputs below are ready. Nothing gets drawn until this agent has synthesized the Research, Content, and Icon agents' output against Section 4 below.
- **Research agent** — before designing anything, re-reads `ECL-Web/references/ECL Design System.html`, `ECL-Web/references/Flow 5 - New Run.html`, `ECL-Web/references/Flow 7 - Results Explorer.html`, and their CSS (`styles/tokens.css`, `styles/base.css`, `styles/components.css`, `styles/appshell.css`, `styles/newrun.css`, `styles/results.css`) directly from disk and confirms every token/class value quoted in Section 3 of this brief still matches. If anything has drifted, the Research agent's findings — not this brief — are authoritative; flag the discrepancy to the Lead agent before proceeding.
- **Content/Copy agent** — writes every piece of new microcopy this brief requires: the 8 new criteria names and their plain-language rationale text (Section 4.2), empty-state copy, error-state copy, and the "preview, not yet persisted" disclosure text (Section 4.4). Must match the platform's documented voice, quoted verbatim from the Design System: *"no cheerleading, no full-page spinners, no celebratory motion."* Terse, factual, audit-appropriate — this is a banking compliance tool, not a consumer app.
- **Icon agent** — designs any new inline SVG icons this brief's new screens require (candidates: a checklist/criteria icon, a transition-matrix icon, a "next month" / forward-staging icon, a reproducibility/version-stamp icon) and adds them as `<symbol id="i-...">` entries in the same hand-authored, Lucide-style convention already used in every existing flow file (see Section 3.6). Do not import an icon library or reference an external SVG file — every existing flow embeds its own local sprite, and these new screens must follow that exact pattern.
- **Convergence**: the Lead agent takes the Research agent's confirmed ground truth, the Content agent's copy, and the Icon agent's symbols, and produces the final artboards per Section 4, then checks the result against Section 8's definition of done before calling this brief complete.

---

## 3. Ground Truth — the ECL Design System (verbatim)

This is Flow 0, `ECL Design System.html`, labeled in-file as a **locked "Inspiration Brief."** Treat every value below as fixed. Do not introduce new colors, fonts, spacing values, or icon conventions — extend the existing system, don't invent a parallel one.

### 3.1 Color — Light (`:root`)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAFAFB` | page background |
| `--surface` | `#FFFFFF` | cards/panels |
| `--surface-raised` | `#FFFFFF` | popovers/toasts |
| `--surface-sunken` | `#F4F4F7` | table headers, subtle fills |
| `--border` | `#E7E7EE` | hairline dividers |
| `--border-strong` | `#D2D2DC` | input borders |
| `--text` | `#16161D` | body text |
| `--text-muted` | `#5B5B6B` | secondary text |
| `--text-subtle` | `#9494A4` | placeholders/icons |
| `--accent` | `#6D4AFF` | primary brand purple |
| `--accent-hover` | `#5C3AE6` | |
| `--accent-active` | `#4E2FCC` | |
| `--accent-subtle` | `#F1EDFF` | tinted backgrounds |
| `--accent-border` | `#DAD0FF` | |
| `--info` | `#1C9CB0` | secondary data color |
| `--success` | `#1F8F57` | success-only, never used as brand |
| `--warning` | `#9A6800` | |
| `--danger` | `#C5403E` | |
| `--focus` | `#6D4AFF` | focus ring |

### 3.2 Color — Dark (`[data-theme="dark"]`, "a first-class peer, not an inversion")

`--bg:#0B0C1A` `--surface:#14162A` `--surface-raised:#1B1E38` `--surface-sunken:#0E0F22` `--border:#262A45` `--border-strong:#383D60` `--text:#ECEDF5` (never pure white) `--text-muted:#9A9DBA` `--text-subtle:#686C8E` `--accent:#8B6CFF` `--accent-hover:#9D82FF` `--accent-active:#7C5BF5` `--accent-subtle:#1E1B3C` `--info:#4FD4E6` `--success:#43C281` `--warning:#E0A33A` `--danger:#F06A6A`

### 3.3 Stage colors — semantic, and **always shape + color + text together, never color alone**

`--stage1: var(--text-muted)` · `--stage2: var(--warning)` · `--stage3: var(--danger)` · `--offbooks: var(--text-subtle)`

This rule already matches WCAG 2.2 guidance (Section 5) — apply it identically to the new criteria checklist's pass/warn/fail states.

### 3.4 Typography

- `--font-ui`: `"Hanken Grotesk", system-ui...` — all dense UI text, 14px base
- `--font-display`: `"Spectral", Georgia, serif` — headlines only; italic used for emphasis
- `--font-mono`: `"Geist Mono", "JetBrains Mono", ui-monospace...` — **every numeric figure and schematic micro-label**, always with `font-feature-settings: "tnum" 1` (tabular numerals), right-aligned in tables
- Loaded via Google Fonts: `Hanken+Grotesk:wght@400;500;600;700`, `Spectral:ital,wght@0,400;0,500;0,600;1,400;1,500`, `Geist+Mono:wght@400;500`
- Scale: `--fs-display` 28→32px (clamp) · `--fs-h1` 22→24px · `--fs-h2` 18→20px · `--fs-h3` 16px · `--fs-body` 14px · `--fs-caption` 12px · `--fs-mono` 13px · `--fs-micro` 11px (all-caps schematic labels, mono, `letter-spacing:0.06em`)
- Weights: 400/500/600/700 only

### 3.5 Spacing, radius, shadow, motion, density

- **Spacing** (4px base): `--sp-1:4px --sp-2:8px --sp-3:12px --sp-4:16px --sp-5:20px --sp-6:24px --sp-8:32px --sp-12:48px --sp-16:64px`; page gutter `clamp(16px, 1rem+0.5vw, 24px)`
- **Radius**: `--r-sm:4px` (inputs/chips/buttons) · `--r-md:6px` (cards/panels) · `--r-lg:12px` (modals/sheets) · `--r-full:999px`
- **Shadow — border-first policy**: resting elements have **no shadow at all**; shadow only appears on hover/overlay. `--shadow-hover: 0 1px 2px rgba(16,16,24,.06), 0 1px 3px rgba(16,16,24,.04)` · `--shadow-pop: 0 6px 18px rgba(16,16,24,.10), 0 1px 2px rgba(16,16,24,.06)` · `--shadow-modal: 0 12px 32px rgba(16,16,24,.16), 0 2px 6px rgba(16,16,24,.08)` (deeper black-alpha in dark mode). New criteria-checklist cards and matrix panels must follow this — bordered, flat at rest.
- **Motion**: `--t-micro:120ms --t-fast:180ms --t-base:240ms --t-slow:320ms`; `--ease-out: cubic-bezier(.22,1,.36,1)`; nothing exceeds 400ms except marketing reveals (not relevant here); **numbers never animate/count-up**; full `prefers-reduced-motion` support required.
- **Density**: `[data-density]` comfortable (default, `--row-h:44px`) vs. compact (`--row-h:32px`, **documented default for all data tables**). The new loan-level preview table is a data table — default it to compact, matching Flow 7's convention, with the same live density toggle if the panel has room for a toolbar.

### 3.6 Iconography

Documented rule, verbatim: **"One set — Lucide-class, 24px viewBox, 1.5px stroke, inherits `currentColor`."** Not an imported library: every HTML file embeds its own local `<svg><defs><symbol id="i-...">` sprite of hand-drawn Lucide-style paths, referenced via `<use href="#i-name">`. Sizing utilities: `.ic` (16px default), `.ic-14`, `.ic-20`, `.ic-24`. New icons (Section 2) must be added the same way, inline, in whichever flow file uses them.

### 3.7 Component patterns already available — reuse, don't rebuild

- **Buttons**: `.btn-primary` / `.btn-secondary` / `.btn-ghost` / `.btn-danger` / `.btn-icon`, sizes sm/default/lg, spinner + disabled (opacity 0.5) states.
- **Tags/badges/pills**: `.tag` (neutral/accent/success/warning/danger/info), `.badge` (numeric count pill), `.pill-*` status pills — **always dot/icon + color + text**, `.pill-running` has a pulsing-dot animation. The new criteria checklist's pass/warn/fail rows should be built from this pattern, not a new one.
- **Cards**: `.card` (border + `r-md`, no resting shadow), `.card-interactive` (adds hover shadow/border).
- **Tables**: `.tbl` — sticky header, right-aligned tabular-numeral columns, sortable headers, row hover/selected states, `.tbl-foot` pagination bar. There is a dedicated **`.matrix`** table style already built for the PD transition matrix (bordered grid cells, mono figures, tinted by magnitude) — this is exactly the component to reuse for the new transition-matrix preview (see Flow 7's `.pd-matrix` implementation for the exact hover-scale + gradient-legend behavior to replicate).
- **KPI/StatPill**: `.kpi` (label + big mono value + delta arrow; delta-up = success color, delta-down = danger color).
- **Progress/stepper**: `.progress` (thin bar + indeterminate variant), `.tracker` (vertical numbered/checked stepper with connecting line), `.stepper` (horizontal numbered stepper with connecting line). Flow 5 already has its own scoped variants of these (`.run-steps`, `.compute-tracker`/`.ctrack` in `newrun.css`) that mirror the generic components almost 1:1 — follow that existing scoped-duplication pattern for any new stepper/tracker element rather than introducing a third variant.
- **Empty/error/loading state library** (`.state`): icon-in-box + heading + description + CTA; skeleton shimmer blocks (`.skel`). House rule, verbatim: **"no cheerleading, no full-page spinners, no celebratory motion."** Every new state in Section 4.4 must draw from this exact library.
- **Notices**: `.banner` (accent-tinted, persistent), `.callout` (info/success/warning/danger variants), `.toast` (modal-shadow, dismissible).
- **Domain-specific, already built**: `.dropzone` / `.filepill` (upload), the "Engine progress" tracker pattern (PD→LGD→EAD steps with live sub-progress bar) — the engine-version/reproducibility stamp (Section 4.4) should sit visually near this family, not invent a new badge style.

### 3.8 File/CSS layering — new screens must slot into this, not bypass it

Every authenticated flow loads, in order: `tokens.css → base.css → components.css` (universal) → `appshell.css` (sidebar/topbar shell, breakpoints at 1024px icon-only and 768px slide-in sheet) → its own flow-specific sheet. Flow 5 loads `newrun.css` last. **The new PD Validation Detail panel is an extension of Flow 5 and belongs in `newrun.css`** (or a clearly-named extension file loaded after it) — it must not duplicate tokens/base/components, and it must reuse Flow 7's `.matrix`/`.pd-matrix` rules rather than reimplementing them (import/reference `results.css`'s matrix rules, or copy them verbatim into `newrun.css` if the design tool can't cross-reference — but keep the values identical, don't reinterpret).

### 3.9 Important caveat

These reference mockups are **static HTML + CSS only** — every flow file's closing `<script src="scripts/f5newrun.js">`-style tag points at a `scripts/` directory that does not exist anywhere in the repo. There is no working interactivity to preserve or reverse-engineer; state switching, table population, and wizard progression are implied by `data-*` attributes and separate marked-up panels (e.g. `#rs-upload`, `#rs-validate`), not driven by real JS. Design the new screens the same way: as additional static, self-contained HTML panels/states, consistent with how Flow 5 already represents Upload/Validate/Confirm/Compute/Success/Failure as six separate `<section class="run-screen">` blocks.

---

## 4. Screen-by-Screen Brief

**In scope:** Flow 5 (`New Run.html`) only — specifically its Validate step and the PD upload card.
**Out of scope:** LGD/EAD getting the same independent-validation treatment (explicitly deferred per `PD_VALIDATION_REDESIGN.md` §8), any redesign of Flow 7 itself (it is a *reuse source* for the matrix/table components, not a target), and every other flow (1–4, 6, 8–10).

### 4.1 PD upload card — independent "Validate PD" action

Today, Flow 5's Upload step (`#rs-upload`) shows three `.upload-zone` blocks (PD multi-file, LGD single-file, EAD single-file) feeding into one combined Validate step later in the wizard. Add a **"Validate PD" action** directly on the PD `.upload-zone` card, enabled as soon as ≥1 PD file has been added, independent of whether LGD/EAD have anything uploaded yet. Visually: a `.btn-secondary` (not primary — this is a sub-action within the card, the wizard's own "Continue" remains primary) placed near the existing file-pill list, using the existing `.filepill` treatment for the uploaded PD file(s) with a small state change to reflect "validating…" / "validated" without inventing a new pill style.

### 4.2 PD Validation Detail panel — criteria checklist

Triggered by 4.1's action. Replaces the current bare `.val-file` accordion (which today only shows a "Valid" pill with nothing further, or a list of errors if any exist) with a real checklist, one row per criterion, each showing: name, a `.pill-*`-style pass/warn/fail indicator (dot/icon + color + text, per 3.3/3.7 — never color alone), and a one-line plain-language rationale. Cover all of the following (existing structural checks keep their current codes; the eight new ones are numbered onward for consistency with the codebase's `EC-` scheme documented in `test_data/README.md`, referenced by `PD_VALIDATION_REDESIGN.md` §5):

| Code | Criterion | Rationale shown to the user (Content agent: refine wording, keep the substance) |
|---|---|---|
| EC-02–EC-10 | Structural checks (columns present, Loan ID/Segment non-blank, dates valid, staging values valid, amounts non-negative, segment recognized, no duplicate loan/month rows) | *(existing — carry forward as-is)* |
| EC-11 | Chronological month coverage | "No gaps in monthly reporting per segment — a missing month silently distorts the transition matrix." |
| EC-12 | Loan ID format consistency | "Loan ID format stays consistent across reporting periods, so loans can be matched month to month." |
| EC-13 | Minimum transition history | "Enough monthly observations exist to treat the transition matrix as statistically stable." |
| EC-14 | Stage-mix plausibility | "The Stage 1/2/3 mix for this segment falls within a plausible range." |
| EC-15 | Marginal PD bounds | "Every computed default probability is between 0% and 100%, and default probability never decreases over time." |
| EC-16 | Cure rate sanity | "The rate of Stage 3 loans recovering to a performing stage is within a plausible range." |
| EC-17 | Offbooks rate sanity | "The share of loans exiting the book in a single month is consistent with this segment's history." |
| EC-18 | Reproducibility / engine version | *(always shown, informational — not pass/fail)* "This preview was generated by Engine v1.0.3 and will reproduce identically for this file." |

Group visually: Structural (collapsed by default if all pass, matching today's collapsed-when-clean pattern) above Business/Statistical (expanded by default — these are the new, more important-to-surface checks) above the EC-18 info line, styled as a `.callout` (info variant), not a checklist row.

### 4.3 Loan-level preview table + transition matrix

Below the checklist: a sortable, searchable loan-level table built on the existing `.tbl` component (compact density per 3.5), columns **Loan ID · Segment · Reporting Month · Staging · Next Month Staging** (the last column is new — style it identically to the existing Staging column, using the same stage-color convention from 3.3, so the "before → after" read is immediate). Support sort-by-column-header (Flow 7's `SegmentLoansTable` pattern already has sortable headers in spirit even if not fully wired — make headers genuinely clickable here) and a search-by-Loan-ID input using the existing input + icon-prefix pattern from 3.7. Group/filter by Reporting Month using the same chip/filter-popover pattern Flow 7 uses for its Stage filter.

Beside or below the table: the **per-segment transition matrix**, reusing Flow 7's `.pd-matrix`/`.matrix` component verbatim — same heat-mapped mono-grid cells, same hover-scale-and-tooltip-exact-value behavior, same gradient legend — plus the segment's cure rate shown as a `.kpi`-style stat beside it. If multiple segments are present in the uploaded PD file, use a segment switcher (tabs or a select) consistent with existing patterns rather than stacking every segment's matrix at once.

### 4.4 Loading / empty / error states

- **Validating (loading)**: use the existing `.state` + `.skel` skeleton-shimmer pattern already documented — not a spinner, not a progress percentage (numbers never animate per 3.5). Mirror the tone of Flow 5's existing "scanning" state in `#rs-validate` but scoped to PD alone.
- **No PD file yet**: standard `.state` empty pattern (icon-in-box + heading + description + CTA) prompting upload, consistent with other empty states in the mockup set (e.g. Flow 4's `#dashEmpty`).
- **Blocking failure**: reuse the existing blocking-error treatment from `.val-file`/`.val-summary` (danger-tinted banner + itemized fix instructions) — this part doesn't need to change, just needs to sit above the new checklist rather than replace it entirely when there are zero passing criteria to show.
- Every state must degrade gracefully at both the 1024px and 768px `appshell.css` breakpoints (Section 6).

---

## 5. External Design-Pattern Grounding

Two points of outside research, applied concretely rather than left as generic advice:

1. **Validation/status UI in comparable fintech products** (Wise, Stripe, Ramp) surfaces state and rule violations *inline, on the same screen*, not behind an extra click — directly supports putting the full criteria checklist in the Validate step itself rather than a drill-in. WCAG 2.2 requires color never be the sole means of conveying pass/fail state (roughly 1 in 12 men and 1 in 200 women have a color vision deficiency) — the ECL design system's existing "dot/icon + color + text, never color alone" pill rule (3.3, 3.7) already satisfies this; apply it identically to every checklist row. For regulator-facing, decision-critical numbers, pair the value with an exact label and a freshness/version stamp — this is precisely what EC-18's engine-version disclosure (4.2) is for, and is standard convention on Bloomberg/LSEG-class terminals.
2. **Transition-matrix/heatmap UI best practice**: keep row/column state ordering consistent and identical on both axes (Stage 1/2/3 → Stage 1/2/3/Offbooks, matching Flow 7's existing `.pd-matrix` orientation exactly — don't reorder), use a sequential color scale at ≥4.5:1 contrast (WCAG AA), always make exact values available (hover or in-cell, not pattern-reading alone), and avoid density overload — not a concern at this matrix's native 3×3/3×4 scale, so no aggregation is needed.

**Sources:**
- [Fintech Dashboard Design: 9 Real Products, Analyzed (2026)](https://adminlte.io/blog/fintech-dashboard-design-examples/)
- [Fintech design guide with patterns that build trust](https://www.eleken.co/blog-posts/modern-fintech-design-guide)
- [Top 10 Fintech UX Design Best Practices for 2026](https://wsa.design/news/top-10-fintech-ux-design-best-practices-for-2026)
- [Fintech Dashboard Design: Patterns & Real Examples | Masterly](https://www.themasterly.com/blog/fintech-dashboard-design-guide)
- [Dashboard UI Best Practices for Insightful Data Visualization](https://refero.design/p/dashboard-ui-best-practices/)
- [Heatmap Visualization Guide 2025: Examples & Best Practices](https://chartgen.ai/resources/blog/heatmap-data-visualization-complete-guide-examples)
- [Dynamic Heatmap Selection: Enhancing Dashboard Interaction and User Experience](https://bibb.pro/post/dynamic-heatmap-selection-enhancing-dashboard-interaction-and-user-experience/)

---

## 6. Responsiveness & Accessibility Requirements

- Follow `appshell.css`'s existing breakpoints exactly: sidebar collapses to icon-only under 1024px, becomes a slide-in sheet under 768px. The new checklist + table + matrix layout must reflow at both — e.g. the table/matrix side-by-side arrangement (4.3) should stack vertically under 1024px, and the loan table should degrade to a card-per-row layout (not a horizontally-scrolling table) under 768px, consistent with how Flow 7 already handles its segment-level panels on small screens.
- Every color token used must have its dark-mode pair applied via `[data-theme="dark"]` (3.2) — build and check both themes, not just light.
- WCAG AA contrast (4.5:1 minimum) for all text and for the transition-matrix color scale specifically.
- Every status/pass-fail indicator: color + shape/icon + text, no exceptions (3.3).
- Respect `prefers-reduced-motion` — no animated transitions on the new panel beyond what the existing `--t-*` durations and `.skel` shimmer already define as acceptable.

---

## 7. Output & Handoff

**Recommended landing spot:** `ECL-Web/references/v2/Flow 5 - New Run.html`, plus an extended `newrun.css` (or a clearly-named additional sheet loaded after it, per 3.8) — a **versioned addition**, not an in-place edit of the current `references/Flow 5 - New Run.html`. This keeps the existing `references/` set intact as the "before" record (useful for comparing against once the redesign is reviewed) while the new file follows the exact same shared-CSS-layering convention (`tokens.css → base.css → components.css → appshell.css → newrun.css`) so it drops into the project the same way every other flow file already does. This is a recommendation, not a hard requirement — confirm with the project owner before finalizing file placement if there's a reason to prefer an in-place edit instead.

Note for whoever executes this brief: `/design`'s native output is a multi-artboard canvas (`.dc.html` artboards on a pan/zoom canvas, published as an Artifact) — that's the right tool for *drafting and iterating* on this screen visually. Once the design is approved, it still needs a final export/translation pass into a real static HTML file matching the existing mockup format described above, since that's the format every other file in `references/` uses and what a future implementation pass will read from.

---

## 8. Definition of Done

- [ ] Every color, font, spacing, radius, shadow, and motion value used traces to Section 3 — nothing invented.
- [ ] Every new icon follows the 24px/1.5px-stroke inline-sprite convention (3.6) — no external icon library, no image assets.
- [ ] The criteria checklist (4.2) covers all of EC-02 through EC-18 with plain-language rationale for each.
- [ ] The loan table (4.3) is sortable and searchable, includes the Next Month Staging column, and reuses `.tbl` compact density.
- [ ] The transition matrix (4.3) is visually identical in style/behavior to Flow 7's existing `.pd-matrix` (same hover, same legend, same axis ordering).
- [ ] Loading, empty, and blocking-error states (4.4) all exist and draw from the documented `.state`/`.skel` library — no full-page spinners, no celebratory motion.
- [ ] Layout reflows correctly at the 1024px and 768px breakpoints; loan table degrades to cards, not horizontal scroll, under 768px.
- [ ] Both light and dark themes are built and checked, not just light.
- [ ] Every status indicator pairs color with shape/icon and text.
- [ ] LGD, EAD, Confirm, Compute, and Flow 7 itself are untouched — scope stayed on Flow 5's PD validation only.
