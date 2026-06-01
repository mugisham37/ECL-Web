import type { RunListItem, RunDetail, AuditEvent, RunInputFile, EngineInfo } from "./runs-types";
import type { KpiData, SegmentBar } from "./dashboard-types";

// ── Shared engine info ─────────────────────────────────────────────────────

const ENGINE: EngineInfo = {
  version: "v1.0.3",
  releasedDate: "2 Apr 2026",
  pdMethod: "Loan-amount-weighted transition matrix · 299 monthly powers · per-segment cure rate",
  lgdMethod: "Collateral discounted by haircut & time-to-realization · per-customer proportioning",
  eadMethod: "Forward rundown with missed-payment compounding",
  pdFilesCombined: true,
  deterministic: true,
};

// ── Shared KPIs (complete run) ─────────────────────────────────────────────

const KPIS_COMPLETE: KpiData[] = [
  { id: "total-ecl", label: "Total ECL", currencyPrefix: "KES", value: "1,284,500", delta: 4.2, deltaDir: "up", subNote: "vs previous run" },
  { id: "coverage", label: "Coverage ratio", helpText: "ECL ÷ total outstanding", value: "2.41%", delta: -0.02, deltaDir: "down", subNote: "vs previous run" },
  { id: "outstanding", label: "Total outstanding", currencyPrefix: "KES", value: "57.4M", deltaDir: "flat", subNote: "11,847 loans" },
  { id: "loans", label: "Loans analysed", value: "11,847", delta: 312, deltaDir: "up", subNote: "vs previous run" },
];

const KPIS_PENDING: KpiData[] = [
  { id: "total-ecl", label: "Total ECL", currencyPrefix: "KES", value: "—" },
  { id: "coverage", label: "Coverage ratio", value: "—" },
  { id: "outstanding", label: "Total outstanding", currencyPrefix: "KES", value: "—" },
  { id: "loans", label: "Loans analysed", value: "—" },
];

// ── Shared segments ────────────────────────────────────────────────────────

const SEGMENTS: SegmentBar[] = [
  { name: "Transport", value: 318 },
  { name: "Agriculture", value: 264 },
  { name: "Trade", value: 212 },
  { name: "Manufacturing", value: 178 },
  { name: "Real Estate", value: 143 },
  { name: "Education", value: 88 },
];

// ── Shared input files ─────────────────────────────────────────────────────

const INPUTS_COMPLETE: RunInputFile[] = [
  { type: "PD", name: "PD_loans_2026-05.xlsx", size: "2.4 MB", sheets: 3, validationStatus: "ok", hash: "a3f9…2c1b" },
  { type: "PD", name: "PD_branch4.xlsx", size: "1.1 MB", sheets: 1, validationStatus: "warn", warningCount: 3, hash: "7d10…b8e4" },
  { type: "LGD", name: "LGD_collateral_05.xlsx", size: "1.1 MB", sheets: 1, validationStatus: "ok", hash: "c81a…77fe" },
  { type: "EAD", name: "EAD_balances_05.xlsx", size: "3.7 MB", sheets: 2, validationStatus: "ok", hash: "e918…5b6d" },
];

const INPUTS_FAILED: RunInputFile[] = [
  { type: "PD", name: "PD_loans_2026-04.xlsx", size: "2.2 MB", sheets: 2, validationStatus: "ok", hash: "b40d…91a2" },
  { type: "LGD", name: "LGD_collateral_05.xlsx", size: "1.1 MB", sheets: 1, validationStatus: "ok", hash: "c81a…77fe" },
  { type: "EAD", name: "EAD_balances_04.xlsx", size: "3.1 MB", sheets: 2, validationStatus: "ok", hash: "7f2e…03cc" },
];

// ── Audit events ───────────────────────────────────────────────────────────

const AUDIT_COMPLETE: AuditEvent[] = [
  { id: "a1", kind: "accent", iconName: "Plus", title: "Run created", description: "Draft initialised", who: "Tendai Mwangi", time: "13:58:02" },
  { id: "a2", kind: "default", iconName: "Upload", title: "Files uploaded", description: "PD_loans_2026-05.xlsx a3f9…2c1b, PD_branch4.xlsx 7d10…b8e4, LGD_collateral_05.xlsx c81a…77fe, EAD_balances_05.xlsx e918…5b6d", who: "Tendai Mwangi", time: "14:18:30" },
  { id: "a3", kind: "ok", iconName: "Check", title: "Validation passed", description: "3 files valid · 3 warnings accepted on PD_branch4.xlsx", who: "Tendai Mwangi", time: "14:21:05" },
  { id: "a4", kind: "accent", iconName: "Zap", title: "Computation started", description: "Engine v1.0.3", who: "system", time: "14:21:40" },
  { id: "a5", kind: "ok", iconName: "Check", title: "PD engine completed", description: "6 segments · 299 powers · 4.1s", who: "system", time: "14:21:44" },
  { id: "a6", kind: "ok", iconName: "Check", title: "LGD engine completed", description: "1,247 loans · 18.7s", who: "system", time: "14:22:03" },
  { id: "a7", kind: "ok", iconName: "Check", title: "EAD & ECL completed", description: "Total ECL KES 1,284,500", who: "system", time: "14:22:18" },
  { id: "a8", kind: "ok", iconName: "Check", title: "Run completed", description: "Outputs saved · elapsed 38s", who: "system", time: "14:22:18" },
  { id: "a9", kind: "default", iconName: "Download", title: "Workbooks downloaded", description: "PD, LGD, EAD, ECL workbooks", who: "Tendai Mwangi", time: "14:25:40" },
];

const AUDIT_FAILED: AuditEvent[] = [
  { id: "b1", kind: "accent", iconName: "Plus", title: "Run created", description: "Draft initialised", who: "J. Otieno", time: "16:30:11" },
  { id: "b2", kind: "default", iconName: "Upload", title: "Files uploaded", description: "3 inputs · LGD_collateral_05.xlsx c81a…77fe", who: "J. Otieno", time: "16:38:02" },
  { id: "b3", kind: "ok", iconName: "Check", title: "Validation passed", description: "All files valid", who: "J. Otieno", time: "16:40:15" },
  { id: "b4", kind: "accent", iconName: "Zap", title: "Computation started", description: "Engine v1.0.3", who: "system", time: "16:40:50" },
  { id: "b5", kind: "ok", iconName: "Check", title: "PD engine completed", description: "6 segments · 4.1s", who: "system", time: "16:40:54" },
  { id: "b6", kind: "err", iconName: "X", title: "Run failed at LGD stage", description: 'Unknown collateral type "Warehouse receipt" · row 412 · ref a3f9-2c1b', who: "system", time: "16:41:09" },
];

const AUDIT_RUNNING: AuditEvent[] = [
  { id: "c1", kind: "accent", iconName: "Plus", title: "Run created", description: "Draft initialised", who: "Tendai Mwangi", time: "13:58:02" },
  { id: "c2", kind: "default", iconName: "Upload", title: "Files uploaded", description: "PD_loans_2026-05.xlsx, LGD_collateral_05.xlsx, EAD_balances_05.xlsx", who: "Tendai Mwangi", time: "14:18:30" },
  { id: "c3", kind: "ok", iconName: "Check", title: "Validation passed", description: "3 files valid · 3 warnings accepted", who: "Tendai Mwangi", time: "14:21:05" },
  { id: "c4", kind: "accent", iconName: "Zap", title: "Computation started", description: "Engine v1.0.3", who: "system", time: "14:21:40" },
  { id: "c5", kind: "ok", iconName: "Check", title: "PD engine completed", description: "6 segments · 4.1s", who: "system", time: "14:21:44" },
  { id: "c6", kind: "accent", iconName: "Clock", title: "LGD engine running…", description: "1,247 loans · in progress", who: "system", time: "14:21:44" },
];

const AUDIT_DELETED: AuditEvent[] = [
  ...AUDIT_COMPLETE,
  { id: "d1", kind: "default", iconName: "Trash2", title: "Run soft-deleted", description: "Retained for audit", who: "A. Karanja", time: "5 May 09:12" },
];

// ── Run list (8 runs) ──────────────────────────────────────────────────────

export const MOCK_RUNS_LIST: RunListItem[] = [
  { id: "c81a…77fe", fullId: "c81a4f9d-2c1b-4e77-9a3f-771afe2c77fe", name: "May 2026", period: "May 2026", createdAt: "30 May 14:22", byInitials: "TM", byName: "Tendai Mwangi", status: "success", eclAmount: 1284500, coverage: "2.41%", currency: "KES" },
  { id: "b40d…91a2", fullId: "b40d3e8a-1f92-4c01-8b5e-9132f4b491a2", name: "Apr 2026", period: "Apr 2026", createdAt: "30 Apr 09:14", byInitials: "AK", byName: "A. Karanja", status: "success", eclAmount: 1232040, coverage: "2.39%", currency: "KES" },
  { id: "7f2e…03cc", fullId: "7f2e91a4-03cc-4d82-bf14-2a8c6e7f03cc", name: "Apr 2026 (rerun)", period: "Apr 2026", createdAt: "28 Apr 16:40", byInitials: "JO", byName: "J. Otieno", status: "failed", eclAmount: null, coverage: null, currency: "KES" },
  { id: "a155…7b91", fullId: "a1557c3d-7b91-4e20-a3f9-8c21d4a17b91", name: "May 2026 (draft)", period: "May 2026", createdAt: "30 May 13:58", byInitials: "TM", byName: "Tendai Mwangi", status: "running", eclAmount: null, coverage: null, currency: "KES" },
  { id: "e918…5b6d", fullId: "e9185c4a-5b6d-4f91-a2b3-7d3e9e185b6d", name: "Mar 2026", period: "Mar 2026", createdAt: "31 Mar 11:02", byInitials: "TM", byName: "Tendai Mwangi", status: "success", eclAmount: 1201880, coverage: "2.36%", currency: "KES" },
  { id: "3c7d…12ff", fullId: "3c7d88b2-12ff-4a30-9c5e-6f2a3c7d12ff", name: "Feb 2026", period: "Feb 2026", createdAt: "28 Feb 10:31", byInitials: "AK", byName: "A. Karanja", status: "success", eclAmount: 1188300, coverage: "2.34%", currency: "KES" },
  { id: "d204…aa18", fullId: "d204b7e1-aa18-4c60-8d3f-1e5b2d204aa1", name: "Jan 2026", period: "Jan 2026", createdAt: "31 Jan 15:47", byInitials: "JO", byName: "J. Otieno", status: "deleted", eclAmount: 1164220, coverage: "2.31%", currency: "KES" },
  { id: "9b81…6e2c", fullId: "9b81c4d3-6e2c-4a71-b8f2-3c9a9b816e2c", name: "Dec 2025 (draft)", period: "Dec 2025", createdAt: "02 Jan 08:20", byInitials: "TM", byName: "Tendai Mwangi", status: "draft", eclAmount: null, coverage: null, currency: "KES" },
];

// ── Run details by fullId ──────────────────────────────────────────────────

const DETAIL_MAP: Record<string, RunDetail> = {
  // Complete
  "c81a4f9d-2c1b-4e77-9a3f-771afe2c77fe": {
    ...MOCK_RUNS_LIST[0],
    elapsed: "38s",
    kpis: KPIS_COMPLETE,
    segments: SEGMENTS,
    inputFiles: INPUTS_COMPLETE,
    auditEvents: AUDIT_COMPLETE,
    engineInfo: ENGINE,
    acceptedWarnings: 3,
  },
  // Running
  "a1557c3d-7b91-4e20-a3f9-8c21d4a17b91": {
    ...MOCK_RUNS_LIST[3],
    kpis: KPIS_PENDING,
    segments: [],
    inputFiles: INPUTS_COMPLETE.slice(0, 3),
    auditEvents: AUDIT_RUNNING,
    engineInfo: ENGINE,
  },
  // Failed
  "7f2e91a4-03cc-4d82-bf14-2a8c6e7f03cc": {
    ...MOCK_RUNS_LIST[2],
    kpis: KPIS_PENDING,
    segments: [],
    inputFiles: INPUTS_FAILED,
    auditEvents: AUDIT_FAILED,
    engineInfo: ENGINE,
    failureDetails: { stage: "LGD", message: 'Unknown collateral type "Warehouse receipt" (LGD_collateral_05.xlsx, row 412). No partial results were saved.', ref: "a3f9-2c1b" },
  },
  // Deleted
  "d204b7e1-aa18-4c60-8d3f-1e5b2d204aa1": {
    ...MOCK_RUNS_LIST[6],
    elapsed: "31s",
    kpis: KPIS_COMPLETE.map((k) => ({
      ...k,
      value: k.id === "total-ecl" ? "1,164,220" : k.id === "coverage" ? "2.31%" : k.id === "outstanding" ? "50.3M" : "11,204",
    })),
    segments: SEGMENTS.map((s) => ({ ...s, value: Math.round(s.value * 0.91) })),
    inputFiles: INPUTS_COMPLETE.slice(0, 3),
    auditEvents: AUDIT_DELETED,
    engineInfo: ENGINE,
    deletedBy: "A. Karanja",
    deletedAt: "5 May 2026",
  },
};

export function getMockRunDetail(fullId: string): RunDetail | null {
  // Try exact match first
  if (DETAIL_MAP[fullId]) return DETAIL_MAP[fullId];
  // Fallback: find by id prefix
  const match = MOCK_RUNS_LIST.find((r) => r.id === fullId || r.fullId === fullId);
  if (!match) return null;
  return DETAIL_MAP[match.fullId] ?? {
    ...match,
    elapsed: "38s",
    kpis: KPIS_COMPLETE,
    segments: SEGMENTS,
    inputFiles: INPUTS_COMPLETE,
    auditEvents: AUDIT_COMPLETE,
    engineInfo: ENGINE,
  };
}
