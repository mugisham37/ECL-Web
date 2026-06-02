export type DrillLevel = "portfolio" | "segment" | "loan" | "empty";

export type StageMix = [number, number, number]; // [s1%, s2%, s3%]

export type PDMatrix = [
  [number, number, number],
  [number, number, number],
  [number, number, number],
];

export interface SegmentData {
  name: string;
  mix: StageMix;
  ecl: number;
  outstanding: number;
  coverage: string;
  loans: number;
  delta: number; // +/- % vs prior period
}

export interface LoanRow {
  id: string;
  customer: string;
  stage: 1 | 2 | 3;
  pd: number; // 12-month PD %
  lgd: number; // LGD %
  ead: number; // KES
  ecl: number; // KES
}

export interface MonthlyRundown {
  month: number;
  marginalPd: number;
  cumulativePd: number;
  ead: number;
  ecl: number;
}

export interface LoanDetail extends LoanRow {
  segment: string;
  outstanding: number;
  collateralValue: number;
  maturity: string;
  rundown: MonthlyRundown[];
}

export interface RunContext {
  runId: string;
  period: string;
  computedAt: string;
  engineVersion: string;
  currency: string;
}

export interface ExplorerFilter {
  search: string;
  stageFilters: [boolean, boolean, boolean];
}

export const defaultFilter: ExplorerFilter = {
  search: "",
  stageFilters: [true, true, true],
};
