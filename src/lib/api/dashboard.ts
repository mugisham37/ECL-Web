import { apiFetch } from "./client";

export interface DashboardKpiRaw {
  id: string;
  label: string;
  help_text?: string;
  currency_prefix?: string;
  value: string;
  delta?: number;
  delta_dir?: "up" | "down" | "flat";
  sub_note?: string;
  stale_as_of?: string;
}

export interface DashboardSegmentRaw {
  name: string;
  value: number;
}

export interface DashboardStageRaw {
  stage: "Stage 1" | "Stage 2" | "Stage 3";
  percent: number;
  color_var: number;
}

export interface DashboardTrendPointRaw {
  label: string;
  value: number;
}

export interface DashboardRunRaw {
  id: string;
  full_id?: string;
  period: string;
  by_initials: string;
  by_name: string;
  status: string;
  ecl_amount: number | null;
  currency: string;
}

export interface DashboardActiveRunRaw {
  id: string;
  status: string;
  progress?: number;
  period?: string;
  failure_ref?: string;
}

export interface DashboardRaw {
  kpis: DashboardKpiRaw[];
  segments: DashboardSegmentRaw[];
  stages: DashboardStageRaw[];
  trend: DashboardTrendPointRaw[];
  runs: DashboardRunRaw[];
  active_run: DashboardActiveRunRaw | null;
}

export async function fetchDashboard(
  token: string,
  tenantId: string,
): Promise<DashboardRaw> {
  return apiFetch<DashboardRaw>(`/tenants/${tenantId}/dashboard`, { token });
}
