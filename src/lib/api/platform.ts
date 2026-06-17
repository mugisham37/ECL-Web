import { apiFetch } from "./client";
import { getPublicApiUrl } from "@/lib/env";
import {
  mapAuditLog,
  mapEngineVersion,
  mapHealthService,
  mapPlatformUser,
  mapTenantRecord,
} from "./mappers";
import type { AuditEntry, EngineVersion, HealthService, PlatformUser, TenantRecord } from "@/lib/superadmin-types";

export async function fetchPlatformOverview(token: string) {
  return apiFetch<{
    kpis: {
      tenants_total: number;
      tenants_active: number;
      tenants_trial: number;
      tenants_suspended: number;
      runs_this_month: number;
      runs_today: number;
      mrr_total_usd: number;
    };
    uptime_30d: string;
    trend_14d: { date: string; runs: number }[];
    tenants_by_plan: { trial: number; starter: number; growth: number; enterprise: number };
    recent_audit: Record<string, unknown>[];
  }>("/platform/overview", { token });
}

export async function fetchPlatformTenants(token: string): Promise<TenantRecord[]> {
  const res = await apiFetch<{ data?: Parameters<typeof mapTenantRecord>[0][] } | Parameters<typeof mapTenantRecord>[0][]>(
    "/platform/tenants?per_page=100",
    { token },
  );
  const items = Array.isArray(res) ? res : res.data ?? [];
  return items.map(mapTenantRecord);
}

export async function fetchPlatformUsers(token: string): Promise<PlatformUser[]> {
  const res = await apiFetch<{ data?: Parameters<typeof mapPlatformUser>[0][] } | Parameters<typeof mapPlatformUser>[0][]>(
    "/platform/users?per_page=100",
    { token },
  );
  const items = Array.isArray(res) ? res : res.data ?? [];
  return items.map(mapPlatformUser);
}

export async function fetchPlatformHealth(token: string) {
  const data = await apiFetch<{
    services: { name: string; value: string; state: string }[];
    queue_stats: { running: number; queued: number; avg_wait_seconds: number };
    overall_state: string;
    recent_errors: Record<string, unknown>[];
  }>("/platform/health", { token });
  return {
    ...data,
    services: data.services.map(mapHealthService),
    recentErrors: (data.recent_errors ?? []).map((e) =>
      mapAuditLog(e as Parameters<typeof mapAuditLog>[0]),
    ),
  };
}

export type PlatformHealth = Awaited<ReturnType<typeof fetchPlatformHealth>>;

export async function fetchEngineVersions(token: string): Promise<EngineVersion[]> {
  const res = await apiFetch<{ versions: Parameters<typeof mapEngineVersion>[0][] }>(
    "/platform/engine-versions",
    { token },
  );
  return res.versions.map(mapEngineVersion);
}

export async function fetchAuditLogs(token: string): Promise<AuditEntry[]> {
  const res = await apiFetch<Parameters<typeof mapAuditLog>[0][] | { data: Parameters<typeof mapAuditLog>[0][] }>(
    "/platform/audit-logs?per_page=50",
    { token },
  );
  const items = Array.isArray(res) ? res : res.data ?? [];
  return items.map(mapAuditLog);
}

export async function provisionTenant(
  token: string,
  body: { name: string; admin_email: string; admin_name: string; plan: string; region?: string; start_trial?: boolean },
) {
  return apiFetch("/platform/tenants", { method: "POST", token, body: JSON.stringify(body) });
}

export async function suspendTenant(token: string, tenantId: string, reason?: string) {
  await apiFetch(`/platform/tenants/${tenantId}/suspend`, {
    method: "POST",
    token,
    body: JSON.stringify({ reason }),
  });
}

export async function reactivateTenant(token: string, tenantId: string) {
  await apiFetch(`/platform/tenants/${tenantId}/reactivate`, { method: "POST", token, body: "{}" });
}

export async function extendTrial(token: string, tenantId: string, days: number) {
  await apiFetch(`/platform/tenants/${tenantId}/extend-trial`, {
    method: "POST",
    token,
    body: JSON.stringify({ days }),
  });
}

export async function impersonateTenant(token: string, tenantId: string) {
  return apiFetch<{ impersonation_id: string; access_token: string; tenant_id: string; tenant_name: string }>(
    `/platform/tenants/${tenantId}/impersonate`,
    { method: "POST", token },
  );
}

export async function promoteEngine(token: string, version: string) {
  await apiFetch(`/platform/engine-versions/${version}/promote`, { method: "POST", token });
}

export async function downloadAuditCsv(token: string) {
  const res = await fetch(`${getPublicApiUrl()}/api/v1/platform/audit-logs?export=csv`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "platform-audit.csv";
  a.click();
  URL.revokeObjectURL(url);
}
