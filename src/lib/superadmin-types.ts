export type TenantStatus = "active" | "trial" | "suspended";
export type TenantPlan   = "Starter" | "Growth" | "Enterprise";
export type SuperAdminSection = "overview" | "tenants" | "users" | "health" | "engine" | "audit";

export interface TenantRecord {
  id: string;
  name: string;
  mark: string;
  color: string;
  plan: TenantPlan;
  status: TenantStatus;
  users: number;
  runs: number;
  created: string;
  mrr: number;
}

export interface PlatformUser {
  name: string;
  email: string;
  tenant: string;
  role: "Admin" | "Analyst" | "Reviewer";
  status: "active" | "disabled";
  lastActive: string;
}

export interface HealthService {
  name: string;
  icon: string;
  value: string;
  state: "ok" | "warn" | "down";
}

export interface EngineVersion {
  version: string;
  releaseDate: string;
  isCurrent: boolean;
  tenantsPinned: number;
  changelog: string[];
}

export interface AuditEntry {
  cls: string;
  icon: string;
  title: string;
  description: string;
  actor: string;
  timestamp: string;
}

export type SuperAdminModalKind =
  | { type: "provision" }
  | { type: "impersonate"; tenantIdx: number }
  | { type: "suspend";     tenantIdx: number }
  | { type: "engine-promote"; engineIdx: number }
  | null;
