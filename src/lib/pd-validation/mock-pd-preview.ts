// MOCK: replace when ECL-Server PD preview exists
// (POST /tenants/{id}/runs/{runId}/validate?scope=pd).
// Fixture matches references/v2/Flow 5 - New Run.html Validate screen.

import type { PdLoanPreviewRow, PdPreviewResult, PdSegmentPreview } from "@/lib/new-run-types";

const DEST = ["Stage 1", "Stage 2", "Stage 3", "Offbooks"];

const AGRICULTURE_MATRIX: PdSegmentPreview = {
  segment: "Agriculture",
  destLabels: DEST,
  matrix: [
    [0.864, 0.098, 0.011, 0.027],
    [0.112, 0.635, 0.189, 0.064],
    [0.06, 0.031, 0.884, 0.025],
  ],
  amounts: [
    ["148.6M", "16.9M", "1.9M", "4.6M"],
    ["3.8M", "21.6M", "6.4M", "2.2M"],
    ["0.7M", "0.4M", "10.6M", "0.3M"],
  ],
  stats: { cureRate: 0.091, loansObserved: 412, monthsOfHistory: 3 },
};

function scaledSegment(name: string, loansObserved: number): PdSegmentPreview {
  return {
    ...AGRICULTURE_MATRIX,
    segment: name,
    stats: { ...AGRICULTURE_MATRIX.stats, loansObserved },
  };
}

const LOANS: PdLoanPreviewRow[] = [
  { loanId: "AGR-2024-0142", segment: "Agriculture", reportingMonth: "Oct 2024", reportingMonthKey: "2024-10", staging: 1, nextStaging: 1 },
  { loanId: "AGR-2024-0142", segment: "Agriculture", reportingMonth: "Nov 2024", reportingMonthKey: "2024-11", staging: 1, nextStaging: 2 },
  { loanId: "AGR-2024-0142", segment: "Agriculture", reportingMonth: "Dec 2024", reportingMonthKey: "2024-12", staging: 2, nextStaging: "offbooks" },
  { loanId: "AGR-2024-0177", segment: "Agriculture", reportingMonth: "Oct 2024", reportingMonthKey: "2024-10", staging: 2, nextStaging: 2 },
  { loanId: "AGR-2024-0177", segment: "Agriculture", reportingMonth: "Nov 2024", reportingMonthKey: "2024-11", staging: 2, nextStaging: 3 },
  { loanId: "AGR-2024-0203", segment: "Agriculture", reportingMonth: "Oct 2024", reportingMonthKey: "2024-10", staging: 3, nextStaging: 1 },
  { loanId: "AGR-2024-0203", segment: "Agriculture", reportingMonth: "Nov 2024", reportingMonthKey: "2024-11", staging: 1, nextStaging: 1 },
  { loanId: "AGR-2024-0311", segment: "Agriculture", reportingMonth: "Dec 2024", reportingMonthKey: "2024-12", staging: 1, nextStaging: 1 },
  { loanId: "SME-2024-0088", segment: "SME", reportingMonth: "Oct 2024", reportingMonthKey: "2024-10", staging: 1, nextStaging: 1 },
  { loanId: "SME-2024-0088", segment: "SME", reportingMonth: "Nov 2024", reportingMonthKey: "2024-11", staging: 1, nextStaging: 2 },
  { loanId: "RET-2024-1002", segment: "Retail", reportingMonth: "Oct 2024", reportingMonthKey: "2024-10", staging: 1, nextStaging: 1 },
  { loanId: "COR-2024-0041", segment: "Corporate", reportingMonth: "Nov 2024", reportingMonthKey: "2024-11", staging: 2, nextStaging: 2 },
  { loanId: "MTG-2024-2210", segment: "Mortgage", reportingMonth: "Dec 2024", reportingMonthKey: "2024-12", staging: 1, nextStaging: 1 },
];

export const MOCK_PD_PREVIEW: PdPreviewResult = {
  status: "warn",
  isMock: true,
  engineVersion: "v1.0.3",
  loans: LOANS,
  segments: [
    AGRICULTURE_MATRIX,
    scaledSegment("SME", 96),
    scaledSegment("Retail", 140),
    scaledSegment("Corporate", 48),
    scaledSegment("Mortgage", 72),
  ],
  criteria: [
    { id: "ec-02", code: "EC-02", name: "Required columns present", category: "structural", outcome: "pass", rationale: "Loan ID, SEGMENT, Reporting Month, Staging and Loan Amount are all present in the file." },
    { id: "ec-03", code: "EC-03", name: "Loan ID present", category: "structural", outcome: "pass", rationale: "Every row has a non-blank Loan ID." },
    { id: "ec-04", code: "EC-04", name: "Segment present", category: "structural", outcome: "pass", rationale: "Every row has a non-blank SEGMENT value." },
    { id: "ec-05", code: "EC-05", name: "Reporting month valid", category: "structural", outcome: "pass", rationale: "Every Reporting Month parses as a real calendar date." },
    { id: "ec-06", code: "EC-06", name: "Staging value valid", category: "structural", outcome: "pass", rationale: "Every Staging value is exactly \"Stage 1\", \"Stage 2\" or \"Stage 3\"." },
    { id: "ec-07", code: "EC-07", name: "Loan amount non-negative", category: "structural", outcome: "pass", rationale: "Every Loan Amount is zero or greater." },
    { id: "ec-08", code: "EC-08", name: "Segment recognized", category: "structural", outcome: "pass", rationale: "Every SEGMENT value matches one this tenant has configured." },
    { id: "ec-10", code: "EC-10", name: "No duplicate rows", category: "structural", outcome: "pass", rationale: "No (Loan ID, Reporting Month) pair repeats." },
    { id: "ec-11", code: "EC-11", name: "Chronological month coverage", category: "business", outcome: "pass", rationale: "Oct, Nov and Dec 2024 are all present for Agriculture — no gaps to silently distort the transition matrix." },
    { id: "ec-12", code: "EC-12", name: "Loan ID format consistency", category: "business", outcome: "pass", rationale: "Loan IDs follow one consistent pattern (AGR-2024-####) across all three months." },
    { id: "ec-13", code: "EC-13", name: "Minimum transition history", category: "business", outcome: "review", rationale: "Only 3 monthly transitions observed for Agriculture — the matrix below will stabilise as more months are uploaded." },
    { id: "ec-14", code: "EC-14", name: "Stage-mix plausibility", category: "business", outcome: "pass", rationale: "Stage 1/2/3 distribution for Agriculture falls within the expected range for this segment." },
    { id: "ec-15", code: "EC-15", name: "Marginal PD bounds", category: "business", outcome: "pass", rationale: "Every computed default probability is between 0% and 100%, and never decreases over time." },
    { id: "ec-16", code: "EC-16", name: "Cure rate sanity", category: "business", outcome: "pass", rationale: "9.1% of Stage 3 loans recover to a performing stage — within the plausible range." },
    { id: "ec-17", code: "EC-17", name: "Offbooks rate sanity", category: "business", outcome: "review", rationale: "4 loans exited Agriculture in Dec 2024 — a little above the segment's trailing average. Worth a quick check." },
    { id: "ec-18", code: "EC-18", name: "Reproducibility / engine version", category: "info", outcome: "info", rationale: "This preview was generated by Engine v1.0.3 and will reproduce identically for this file, and nothing has been saved yet." },
  ],
};
