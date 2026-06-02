import type {
  SegmentData,
  LoanRow,
  PDMatrix,
  RunContext,
  LoanDetail,
} from "./results-types";

export function fmtKes(n: number): string {
  return Math.abs(n).toLocaleString("en-US");
}

export const MOCK_RUN_CONTEXT: RunContext = {
  runId: "c81a…77fe",
  period: "May 2026",
  computedAt: "30 May 2026",
  engineVersion: "v1.0.3",
  currency: "KES",
};

export const MOCK_SEGMENTS: SegmentData[] = [
  { name: "Transport",     mix: [62, 26, 12], ecl: 318450,  outstanding: 12940000, coverage: "2.46%", loans: 1284, delta:  5.1 },
  { name: "Agriculture",   mix: [70, 21,  9], ecl: 264120,  outstanding: 11380000, coverage: "2.32%", loans: 2110, delta: -1.4 },
  { name: "Trade",         mix: [58, 28, 14], ecl: 211880,  outstanding:  7620000, coverage: "2.78%", loans: 1740, delta:  3.2 },
  { name: "Manufacturing", mix: [66, 24, 10], ecl: 178300,  outstanding:  8110000, coverage: "2.20%", loans:  980, delta:  0.6 },
  { name: "Real Estate",   mix: [74, 18,  8], ecl: 142960,  outstanding:  9240000, coverage: "1.55%", loans:  420, delta: -2.8 },
  { name: "Education",     mix: [80, 14,  6], ecl:  88410,  outstanding:  5130000, coverage: "1.72%", loans: 1310, delta:  1.1 },
  { name: "SME",           mix: [55, 30, 15], ecl:  79560,  outstanding:  3010000, coverage: "2.64%", loans: 2003, delta:  6.7 },
];

export const MOCK_LOANS: LoanRow[] = [
  { id: "TRN-04821", customer: "Mwangi Transporters Ltd", stage: 2, pd: 11.4, lgd: 38.5, ead: 2410000, ecl: 105820 },
  { id: "TRN-04822", customer: "Rift Cargo Co",           stage: 1, pd:  2.1, lgd: 35.0, ead: 1820000, ecl:  13380 },
  { id: "TRN-04825", customer: "Coast Haulage",           stage: 3, pd: 64.0, lgd: 52.0, ead:  940000, ecl: 312900 },
  { id: "TRN-04830", customer: "Nyeri Movers",            stage: 1, pd:  1.8, lgd: 30.5, ead: 2110000, ecl:  11620 },
  { id: "TRN-04833", customer: "Eastlands Logistics",     stage: 2, pd:  9.7, lgd: 41.0, ead: 1560000, ecl:  62050 },
  { id: "TRN-04840", customer: "Savannah Express",        stage: 1, pd:  2.4, lgd: 33.2, ead: 3050000, ecl:  24290 },
  { id: "TRN-04846", customer: "Mombasa Freight",         stage: 3, pd: 71.0, lgd: 48.0, ead:  680000, ecl: 231740 },
  { id: "TRN-04851", customer: "Highland Carriers",       stage: 2, pd:  8.9, lgd: 39.5, ead: 1290000, ecl:  45360 },
];

export const MOCK_MATRIX: PDMatrix = [
  [0.942, 0.051, 0.007],
  [0.214, 0.689, 0.097],
  [0.038, 0.061, 0.901],
];

const BASE_RUNDOWN = [
  { month: 1, marginalPd: 0.95, cumulativePd: 0.95, ead: 2410000, ecl:  920 },
  { month: 2, marginalPd: 0.91, cumulativePd: 1.86, ead: 2388000, ecl: 1760 },
  { month: 3, marginalPd: 0.93, cumulativePd: 2.78, ead: 2366000, ecl: 2580 },
  { month: 4, marginalPd: 1.02, cumulativePd: 3.79, ead: 2344000, ecl: 3470 },
  { month: 5, marginalPd: 1.08, cumulativePd: 4.84, ead: 2321000, ecl: 4360 },
  { month: 6, marginalPd: 1.05, cumulativePd: 5.86, ead: 2298000, ecl: 5180 },
  { month: 7, marginalPd: 0.98, cumulativePd: 6.81, ead: 2274000, ecl: 5910 },
  { month: 8, marginalPd: 1.04, cumulativePd: 7.82, ead: 2251000, ecl: 6720 },
];

export function getLoanDetail(id: string, segment: string): LoanDetail {
  const loan = MOCK_LOANS.find((l) => l.id === id) ?? MOCK_LOANS[0];
  return {
    ...loan,
    segment,
    outstanding: loan.ead + 40000,
    collateralValue: Math.round(loan.ead * 1.28),
    maturity: "Mar 2029 · 34 mo",
    rundown: BASE_RUNDOWN,
  };
}

export function getLoansForSegment(_segment: string): LoanRow[] {
  return MOCK_LOANS;
}

export const PORTFOLIO_TOTALS = {
  ecl: MOCK_SEGMENTS.reduce((a, s) => a + s.ecl, 0),
  outstanding: MOCK_SEGMENTS.reduce((a, s) => a + s.outstanding, 0),
  loans: MOCK_SEGMENTS.reduce((a, s) => a + s.loans, 0),
};
