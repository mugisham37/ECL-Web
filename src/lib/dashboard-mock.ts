import type {
  DashboardData,
  DashboardState,
  KpiData,
  SegmentBar,
  StageSlice,
  TrendPoint,
  Run,
  Notification,
  Tenant,
  AppShellUser,
} from "./dashboard-types";

// ── Base entities ──────────────────────────────────────────────────────────

export const MOCK_USER: AppShellUser = {
  name: "Tendai Mwangi",
  email: "t.mwangi@savannabank.co.ke",
  initials: "TM",
  role: "Administrator",
};

export const MOCK_TENANT: Tenant = {
  id: "t1",
  name: "Savanna Bank PLC",
  currency: "KES",
  role: "Administrator",
  initials: "SB",
};

export const MOCK_TENANTS: Tenant[] = [
  MOCK_TENANT,
  {
    id: "t2",
    name: "Acacia MFI",
    currency: "KES",
    role: "Analyst",
    initials: "AC",
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    kind: "ok",
    title: "Run complete",
    description: "May 2026 ECL · KES 1,284,500",
    timeAgo: "2h",
    read: false,
  },
  {
    id: "n2",
    kind: "warn",
    title: "Run failed at LGD",
    description: "28 Apr · unmapped collateral type",
    timeAgo: "2d",
    read: false,
  },
  {
    id: "n3",
    kind: "info",
    title: "J. Otieno joined",
    description: "Accepted your invite",
    timeAgo: "5d",
    read: true,
  },
];

// ── KPI data ──────────────────────────────────────────────────────────────

const KPI_HEALTHY: KpiData[] = [
  {
    id: "total-ecl",
    label: "Total ECL",
    currencyPrefix: "KES",
    value: "1,284,500",
    delta: 4.2,
    deltaDir: "up",
    subNote: "vs previous run",
  },
  {
    id: "coverage-ratio",
    label: "Coverage ratio",
    helpText: "ECL ÷ total outstanding",
    value: "2.41%",
    delta: -0.12,
    deltaDir: "down",
    subNote: "vs previous run",
  },
  {
    id: "total-outstanding",
    label: "Total outstanding",
    currencyPrefix: "KES",
    value: "57.4M",
    deltaDir: "flat",
    subNote: "11,847 loans",
  },
  {
    id: "loans-analysed",
    label: "Loans analysed",
    value: "11,847",
    delta: 312,
    deltaDir: "up",
    subNote: "vs previous run",
  },
];

const KPI_STALE: KpiData[] = KPI_HEALTHY.map((k) =>
  k.id === "total-ecl"
    ? { ...k, value: "1,198,200", staleAsOf: "30 Apr", delta: undefined, deltaDir: undefined }
    : { ...k, staleAsOf: "30 Apr", delta: undefined, deltaDir: undefined }
);

// ── Chart data ─────────────────────────────────────────────────────────────

export const MOCK_SEGMENTS: SegmentBar[] = [
  { name: "Transport", value: 318 },
  { name: "Agriculture", value: 264 },
  { name: "Trade", value: 212 },
  { name: "Manufacturing", value: 178 },
  { name: "Real Estate", value: 143 },
  { name: "Education", value: 88 },
];

export const MOCK_STAGES: StageSlice[] = [
  { stage: "Stage 1", percent: 58, colorVar: 8 },
  { stage: "Stage 2", percent: 27, colorVar: 3 },
  { stage: "Stage 3", percent: 15, colorVar: 7 },
];

export const MOCK_TREND: TrendPoint[] = [
  { label: "Jun", value: 108 },
  { label: "Jul", value: 116 },
  { label: "Aug", value: 112 },
  { label: "Sep", value: 124 },
  { label: "Oct", value: 131 },
  { label: "Nov", value: 122 },
  { label: "Dec", value: 118 },
  { label: "Jan", value: 129 },
  { label: "Feb", value: 137 },
  { label: "Mar", value: 133 },
  { label: "Apr", value: 123 },
  { label: "May", value: 128 },
];

// ── Runs ──────────────────────────────────────────────────────────────────

export const MOCK_RUNS: Run[] = [
  {
    id: "c81a…77fe",
    period: "May 2026",
    byInitials: "TM",
    byName: "Tendai Mwangi",
    status: "success",
    eclAmount: 1284500,
    currency: "KES",
  },
  {
    id: "b40d…91a2",
    period: "Apr 2026",
    byInitials: "AK",
    byName: "A. Karanja",
    status: "success",
    eclAmount: 1232040,
    currency: "KES",
  },
  {
    id: "7f2e…03cc",
    period: "Apr 2026",
    byInitials: "JO",
    byName: "J. Otieno",
    status: "failed",
    eclAmount: null,
    currency: "KES",
  },
  {
    id: "e918…5b6d",
    period: "Mar 2026",
    byInitials: "TM",
    byName: "Tendai Mwangi",
    status: "success",
    eclAmount: 1201880,
    currency: "KES",
  },
];

// ── State factory ─────────────────────────────────────────────────────────

export function getMockDashboardData(state: DashboardState): DashboardData {
  const base = {
    tenant: MOCK_TENANT,
    allTenants: MOCK_TENANTS,
    user: MOCK_USER,
    segments: MOCK_SEGMENTS,
    stages: MOCK_STAGES,
    trend: MOCK_TREND,
    notifications: MOCK_NOTIFICATIONS,
  };

  switch (state) {
    case "healthy":
      return {
        ...base,
        state,
        kpis: KPI_HEALTHY,
        runs: MOCK_RUNS,
      };

    case "failed":
      return {
        ...base,
        state,
        kpis: KPI_STALE,
        runs: MOCK_RUNS,
        bannerProps: {
          variant: "failed",
          failedAt: "28 May",
          errorRef: "a3f9-2c1b",
        },
      };

    case "running":
      return {
        ...base,
        state,
        kpis: KPI_HEALTHY,
        runs: [
          { ...MOCK_RUNS[0], status: "running", eclAmount: null },
          ...MOCK_RUNS.slice(1),
        ],
        bannerProps: {
          variant: "running",
          progress: 45,
        },
      };

    case "incomplete":
      return {
        ...base,
        state,
        kpis: KPI_HEALTHY,
        runs: [],
        bannerProps: {
          variant: "incomplete",
          setupStep: "segments and collateral types",
        },
      };

    case "empty":
      return {
        ...base,
        state,
        kpis: [],
        runs: [],
        segments: [],
        stages: [],
        trend: [],
      };

    case "loading":
    default:
      return {
        ...base,
        state: "loading",
        kpis: [],
        runs: [],
      };
  }
}
