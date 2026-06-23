import { apiFetch } from "./client";

export interface DashboardKpiRaw {
  id: string;
  label: string;
  helpText?: string;
  currencyPrefix?: string;
  value: string;
  delta?: number;
  deltaDir?: "up" | "down" | "flat";
  subNote?: string;
  staleAsOf?: string;
}

export interface DashboardSegmentRaw {
  name: string;
  value: number;
}

export interface DashboardStageRaw {
  stage: "Stage 1" | "Stage 2" | "Stage 3";
  percent: number;
  colorVar: number;
}

export interface DashboardTrendPointRaw {
  label: string;
  value: number;
}

export interface DashboardRunRaw {
  id: string;
  fullId: string;
  period: string;
  byInitials: string;
  byName: string;
  status: string;
  eclAmount: number | null;
  currency: string;
}

export interface DashboardActiveRunRaw {
  runId: string;
  name: string;
  status: string;
  progress: number;
  stage: string | null;
}

export interface DashboardRaw {
  kpis: DashboardKpiRaw[];
  segments: DashboardSegmentRaw[];
  stages: DashboardStageRaw[];
  trend: DashboardTrendPointRaw[];
  runs: DashboardRunRaw[];
  activeRun: DashboardActiveRunRaw | null;
}

export async function fetchDashboard(
  token: string,
  tenantId: string,
): Promise<DashboardRaw> {
  return apiFetch<DashboardRaw>(`/tenants/${tenantId}/dashboard`, { token });
}
