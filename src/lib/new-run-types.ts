// ── Step machine ───────────────────────────────────────────────────────────

export type NewRunStep =
  | "upload"
  | "validate"
  | "confirm"
  | "compute"
  | "success"
  | "failure";

export const STEP_ORDER: NewRunStep[] = ["upload", "validate", "confirm", "compute"];

export function stepIndex(step: NewRunStep): number {
  const idx = STEP_ORDER.indexOf(step);
  return idx === -1 ? STEP_ORDER.length : idx;
}

// ── Uploaded file ──────────────────────────────────────────────────────────

export type FileInputType = "PD" | "LGD" | "EAD";
export type FileStatus = "ok" | "warn" | "error" | "scan";

export interface UploadedFile {
  id: string;
  name: string;
  size: string;        // "2.4 MB"
  sheets: number;
  type: FileInputType;
  status: FileStatus;
  hash: string;        // "a3f9…2c1b"
}

// ── Validation ────────────────────────────────────────────────────────────

export interface ValidationIssue {
  level: "warn" | "block";
  title: string;
  location: string;    // "Sheet 1 · column F · 14 rows"
  fix: string;
}

export interface ValidationFileResult {
  file: UploadedFile;
  issues: ValidationIssue[];
}

export interface ValidationResult {
  status: "ok" | "warn" | "blocking";
  summary: string;
  subSummary: string;
  fileResults: ValidationFileResult[];
}

// ── Compute ────────────────────────────────────────────────────────────────

export type ComputeStageStatus = "pending" | "active" | "done" | "error";

export interface ComputeStage {
  id: string;
  title: string;
  description: string;
  status: ComputeStageStatus;
  elapsed?: string;
  durationMs: number;
}

export const DEFAULT_COMPUTE_STAGES: Omit<ComputeStage, "status">[] = [
  { id: "pd",  title: "PD engine",    description: "Transition matrices · 299 monthly powers", durationMs: 1600 },
  { id: "lgd", title: "LGD engine",   description: "Discounting collateral · cure rates",       durationMs: 2000 },
  { id: "ead", title: "EAD engine",   description: "Forward rundown · expected balances",        durationMs: 1600 },
  { id: "ecl", title: "ECL assembly", description: "PD × LGD × EAD · discounting to today",    durationMs: 1200 },
];

// ── Result ────────────────────────────────────────────────────────────────

export interface RunResult {
  id: string;          // short "c81a…77fe"
  fullId: string;
  totalEcl: number;
  coverageRatio: string;
  currency: string;
}

// ── Wizard state ──────────────────────────────────────────────────────────

export interface NewRunState {
  step: NewRunStep;
  prevStep: NewRunStep;
  runName: string;
  pdFiles: UploadedFile[];
  lgdFile: UploadedFile | null;
  eadFile: UploadedFile | null;
  combinePdFiles: boolean;
  validationResult: ValidationResult | null;
  isValidating: boolean;
  computeProgress: number;
  computeStages: ComputeStage[];
  result: RunResult | null;
  failureDetails: { stage: string; message: string; ref: string } | null;
  cancelModalOpen: boolean;
}

// ── Actions ───────────────────────────────────────────────────────────────

export type NewRunAction =
  | { type: "SET_RUN_NAME"; name: string }
  | { type: "ADD_PD_FILE"; file: UploadedFile }
  | { type: "REMOVE_PD_FILE"; id: string }
  | { type: "SET_LGD_FILE"; file: UploadedFile | null }
  | { type: "SET_EAD_FILE"; file: UploadedFile | null }
  | { type: "SET_COMBINE_PD"; value: boolean }
  | { type: "GO_TO_STEP"; step: NewRunStep }
  | { type: "START_VALIDATING" }
  | { type: "SET_VALIDATION_RESULT"; result: ValidationResult }
  | { type: "SET_COMPUTE_PROGRESS"; pct: number }
  | { type: "SET_COMPUTE_STAGES"; stages: ComputeStage[] }
  | { type: "SET_RESULT"; result: RunResult }
  | { type: "SET_FAILURE"; details: { stage: string; message: string; ref: string } }
  | { type: "OPEN_CANCEL_MODAL" }
  | { type: "CLOSE_CANCEL_MODAL" };

// ── Mock seed files ───────────────────────────────────────────────────────

export const SEED_FILES: Record<FileInputType, UploadedFile> = {
  PD: { id: "pd1", name: "PD_loans_2026-05.xlsx", size: "2.4 MB", sheets: 3, type: "PD", status: "ok", hash: "a3f9…2c1b" },
  LGD: { id: "lgd1", name: "LGD_collateral_05.xlsx", size: "1.1 MB", sheets: 1, type: "LGD", status: "ok", hash: "c81a…77fe" },
  EAD: { id: "ead1", name: "EAD_balances_05.xlsx", size: "3.7 MB", sheets: 2, type: "EAD", status: "ok", hash: "e918…5b6d" },
};

export const EXTRA_PD_FILE: UploadedFile = {
  id: "pd2", name: "PD_branch4.xlsx", size: "1.1 MB", sheets: 1, type: "PD", status: "warn", hash: "7d10…b8e4",
};

export const DETECTED_SEGMENTS = [
  "Transport", "Agriculture", "Trade", "Manufacturing", "Real Estate", "Education", "SME",
];
