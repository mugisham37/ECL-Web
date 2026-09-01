/**
 * PD-scoped validation + preview.
 *
 * Swap point: when ECL-Server implements
 * POST /tenants/{id}/runs/{runId}/validate?scope=pd
 * returning { criteria, pd_preview }, this module is the only file that
 * should need to change. Components consume PdPreviewResult only.
 *
 * Timeout: same 180s as validateRun(). If preview computation moves into
 * this call, that budget may need revisiting — do not change unilaterally.
 */

import { apiFetch, ApiError } from "@/lib/api/client";
import { MOCK_PD_PREVIEW } from "@/lib/pd-validation/mock-pd-preview";
import type {
  PdCriterion,
  PdCriterionCategory,
  PdCriterionOutcome,
  PdLoanPreviewRow,
  PdPreviewResult,
  PdSegmentPreview,
  PdStage,
  ValidationIssue,
} from "@/lib/new-run-types";

const PD_VALIDATE_TIMEOUT_MS = 180_000;
const MOCK_LATENCY_MS = 450;

export interface PdCriterionRaw {
  id: string;
  code: string;
  name: string;
  category: PdCriterionCategory | string;
  outcome: PdCriterionOutcome | string;
  rationale?: string;
  message?: string;
}

export interface PdLoanPreviewRowRaw {
  loan_id?: string;
  loanId?: string;
  segment: string;
  reporting_month?: string;
  reportingMonth?: string;
  reporting_month_key?: string;
  reportingMonthKey?: string;
  staging: number | string;
  next_staging?: number | string;
  nextStaging?: number | string;
}

export interface PdSegmentPreviewRaw {
  segment: string;
  matrix: number[][];
  amounts?: string[][];
  dest_labels?: string[];
  destLabels?: string[];
  stats: {
    cure_rate?: number;
    cureRate?: number;
    loans_observed?: number;
    loansObserved?: number;
    months_of_history?: number;
    monthsOfHistory?: number;
  };
}

export interface PdValidationResultRaw {
  status: "ok" | "warn" | "blocking";
  criteria?: PdCriterionRaw[];
  pd_preview?: {
    loans?: PdLoanPreviewRowRaw[];
    segments?: PdSegmentPreviewRaw[];
    engine_version?: string;
    engineVersion?: string;
  };
  issues?: Array<{
    id: string;
    level: "warn" | "block";
    title: string;
    location?: string;
    fix?: string;
    category?: string | null;
  }>;
}

function parsePdStage(value: number | string | undefined): PdStage {
  if (value === "offbooks" || value === "Offbooks" || value === 0 || value === "0") {
    return "offbooks";
  }
  const asText = String(value ?? "").toLowerCase().replace(/\s+/g, "");
  if (asText === "1" || asText === "stage1") return 1;
  if (asText === "2" || asText === "stage2") return 2;
  if (asText === "3" || asText === "stage3") return 3;
  if (typeof value === "number" && (value === 1 || value === 2 || value === 3)) {
    return value;
  }
  return 1;
}

function monthKeyFromLabel(label: string): string {
  const match = label.match(/^([A-Za-z]{3})\s+(\d{4})$/);
  if (!match) return label;
  const months: Record<string, string> = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };
  const mm = months[match[1]];
  return mm ? `${match[2]}-${mm}` : label;
}

function mapCriterion(raw: PdCriterionRaw): PdCriterion {
  const category = raw.category as PdCriterionCategory;
  const outcome = raw.outcome as PdCriterionOutcome;
  return {
    id: raw.id,
    code: raw.code,
    name: raw.name,
    category: ["structural", "business", "info"].includes(category) ? category : "business",
    outcome: ["pass", "review", "block", "info"].includes(outcome) ? outcome : "review",
    rationale: raw.rationale ?? raw.message ?? "",
  };
}

function mapLoan(raw: PdLoanPreviewRowRaw): PdLoanPreviewRow {
  const reportingMonth = raw.reportingMonth ?? raw.reporting_month ?? "";
  return {
    loanId: raw.loanId ?? raw.loan_id ?? "",
    segment: raw.segment,
    reportingMonth,
    reportingMonthKey: raw.reportingMonthKey ?? raw.reporting_month_key ?? monthKeyFromLabel(reportingMonth),
    staging: parsePdStage(raw.staging),
    nextStaging: parsePdStage(raw.nextStaging ?? raw.next_staging),
  };
}

function mapSegment(raw: PdSegmentPreviewRaw): PdSegmentPreview {
  return {
    segment: raw.segment,
    matrix: raw.matrix,
    amounts: raw.amounts,
    destLabels: raw.destLabels ?? raw.dest_labels,
    stats: {
      cureRate: raw.stats.cureRate ?? raw.stats.cure_rate ?? 0,
      loansObserved: raw.stats.loansObserved ?? raw.stats.loans_observed ?? 0,
      monthsOfHistory: raw.stats.monthsOfHistory ?? raw.stats.months_of_history ?? 0,
    },
  };
}

export function mapPdValidationResult(raw: PdValidationResultRaw): PdPreviewResult {
  const preview = raw.pd_preview;
  const criteria = (raw.criteria ?? []).map(mapCriterion);
  const mappedIssues: ValidationIssue[] | undefined = raw.issues?.map((issue) => ({
    id: issue.id,
    level: issue.level,
    title: issue.title,
    location: issue.location ?? "—",
    fix: issue.fix ?? "",
    category: issue.category ?? null,
  }));
  const issues =
    mappedIssues?.length
      ? mappedIssues
      : criteria
          .filter((c) => c.outcome === "block")
          .map((c) => ({
            id: c.id,
            level: "block" as const,
            title: `${c.code} · ${c.name}`,
            location: "—",
            fix: c.rationale,
            category: null,
          }));

  return {
    status: raw.status,
    criteria,
    loans: (preview?.loans ?? []).map(mapLoan),
    segments: (preview?.segments ?? []).map(mapSegment),
    engineVersion: preview?.engineVersion ?? preview?.engine_version ?? "v1.0.3",
    isMock: false,
    issues: issues.length ? issues : undefined,
  };
}

function shouldUseMock(err: unknown): boolean {
  if (!(err instanceof ApiError)) return false;
  return err.status === 404 || err.status === 501 || err.status === 400 || err.status === 422;
}

async function mockPreview(): Promise<PdPreviewResult> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  return MOCK_PD_PREVIEW;
}

export async function validatePdRun(
  token: string,
  tenantId: string,
  runId: string,
): Promise<PdPreviewResult> {
  try {
    const raw = await apiFetch<PdValidationResultRaw>(
      `/tenants/${tenantId}/runs/${runId}/validate?scope=pd`,
      { method: "POST", body: JSON.stringify({}), token, timeoutMs: PD_VALIDATE_TIMEOUT_MS },
    );
    if (!raw.criteria?.length || !raw.pd_preview) {
      return mockPreview();
    }
    return mapPdValidationResult(raw);
  } catch (err) {
    if (shouldUseMock(err)) {
      return mockPreview();
    }
    throw err;
  }
}

export function countPdCriteria(criteria: PdCriterion[]): { passed: number; review: number; blocked: number } {
  return {
    passed: criteria.filter((c) => c.outcome === "pass").length,
    review: criteria.filter((c) => c.outcome === "review").length,
    blocked: criteria.filter((c) => c.outcome === "block").length,
  };
}
