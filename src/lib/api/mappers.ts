import type { Member, AdminSegment, CollateralType, TenantProfile } from "@/lib/admin-types";
import type { NotifPrefs, Session, UserProfile } from "@/lib/settings-types";
import type {
  AuditEntry,
  EngineVersion,
  HealthService,
  PlatformUser,
  TenantRecord,
  TenantStatus,
} from "@/lib/superadmin-types";

export function formatRole(role: string): string {
  const map: Record<string, string> = {
    administrator: "Admin",
    analyst: "Analyst",
    reviewer: "Reviewer",
  };
  return map[role.toLowerCase()] ?? role;
}

export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return "Never";
  const dt = new Date(iso);
  const seconds = Math.floor((Date.now() - dt.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  if (seconds < 172800) return "Yesterday";
  return `${Math.floor(seconds / 86400)} days ago`;
}

export function mapUserProfile(data: {
  user: {
    name: string;
    title?: string | null;
    email: string;
    role: string;
    initials: string;
  };
}): UserProfile {
  return {
    name: data.user.name,
    title: data.user.title ?? "",
    email: data.user.email,
    role: formatRole(data.user.role),
    initials: data.user.initials,
  };
}

export function mapNotifPrefs(data: {
  run_completed: boolean;
  run_failed: boolean;
  weekly_summary: boolean;
  member_joined: boolean;
  product_updates: boolean;
}): NotifPrefs {
  return {
    runCompleted: data.run_completed,
    runFailed: data.run_failed,
    weeklySummary: data.weekly_summary,
    memberJoined: data.member_joined,
    productUpdates: data.product_updates,
  };
}

export function mapSession(s: {
  id: string;
  title: string;
  description: string;
  device: string;
  current: boolean;
}): Session {
  return {
    id: s.id,
    icon: s.device === "phone" ? "phone" : "laptop",
    title: s.title,
    description: s.description,
    current: s.current,
  };
}

export function mapMember(m: {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  status: string;
  last_active_at?: string | null;
  is_you: boolean;
}): Member {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    initials: m.initials,
    role: formatRole(m.role) as Member["role"],
    status: m.status as Member["status"],
    lastActive: formatRelativeTime(m.last_active_at),
    isYou: m.is_you,
  };
}

export function mapSegment(s: {
  id: string;
  name: string;
  code: string | null;
  is_active: boolean;
  runs_count: number;
}): AdminSegment {
  return {
    id: s.id,
    name: s.name,
    code: s.code ?? "",
    runsCount: s.runs_count,
    disabled: !s.is_active,
  };
}

export function mapCollateral(c: {
  id: string;
  name: string;
  haircut: number | string;
  time_to_realize: number;
}): CollateralType {
  return {
    id: c.id,
    name: c.name,
    haircut: Number(c.haircut),
    timeToRealize: c.time_to_realize,
  };
}

export function mapTenantProfile(t: {
  name: string;
  reporting_cadence: string;
  currency: string;
  timezone: string;
}): TenantProfile {
  return {
    name: t.name,
    reportingCadence: t.reporting_cadence === "quarterly" ? "Quarterly" : "Monthly",
    currency: t.currency,
    timezone: t.timezone,
  };
}

export function mapTenantRecord(t: {
  id: string;
  name: string;
  plan: string;
  status: string;
  created_at: string;
  mrr?: number;
  runs_count?: number;
}): TenantRecord {
  const colors = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];
  const idx = t.name.charCodeAt(0) % colors.length;
  return {
    id: t.id,
    name: t.name,
    mark: t.name[0]?.toUpperCase() ?? "?",
    color: colors[idx],
    plan: (t.plan.charAt(0).toUpperCase() + t.plan.slice(1)) as TenantRecord["plan"],
    status: t.status as TenantStatus,
    users: 0,
    runs: t.runs_count ?? 0,
    created: new Date(t.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
    mrr: t.mrr ?? 0,
  };
}

export function mapPlatformUser(u: {
  name: string;
  email: string;
  tenant_name?: string | null;
  role?: string | null;
  is_active: boolean;
  last_active_at?: string | null;
}): PlatformUser {
  return {
    name: u.name,
    email: u.email,
    tenant: u.tenant_name ?? "—",
    role: u.role ? (formatRole(u.role) as PlatformUser["role"]) : "Analyst",
    status: u.is_active ? "active" : "disabled",
    lastActive: formatRelativeTime(u.last_active_at),
  };
}

const AUDIT_EVENT_META: Record<string, { cls: string; icon: string; title: string }> = {
  TENANT_PROVISIONED: { cls: "accent", icon: "Rocket", title: "Tenant provisioned" },
  TENANT_SUSPENDED: { cls: "err", icon: "Ban", title: "Tenant suspended" },
  TENANT_REACTIVATED: { cls: "ok", icon: "Check", title: "Tenant reactivated" },
  IMPERSONATION_STARTED: { cls: "accent", icon: "Fingerprint", title: "Impersonation started" },
  IMPERSONATION_ENDED: { cls: "", icon: "Fingerprint", title: "Impersonation ended" },
  ENGINE_PROMOTED: { cls: "ok", icon: "Cpu", title: "Engine promoted to default" },
  USER_FORCE_RESET: { cls: "", icon: "Users", title: "User force-reset" },
};

export function mapAuditLog(entry: {
  event_type: string;
  user_id?: string | null;
  tenant_id?: string | null;
  created_at: string;
  details?: Record<string, unknown> | null;
  status?: string | null;
}): AuditEntry {
  const meta = AUDIT_EVENT_META[entry.event_type] ?? {
    cls: entry.status === "error" ? "err" : "",
    icon: entry.status === "error" ? "AlertTriangle" : "Check",
    title: entry.event_type.replace(/_/g, " ").toLowerCase(),
  };
  const details = entry.details ?? {};
  const description =
    typeof details.description === "string"
      ? details.description
      : Object.entries(details)
          .filter(([k]) => !["description"].includes(k))
          .map(([k, v]) => `${k}: ${String(v)}`)
          .join(" · ") || "—";
  const actor = entry.user_id ? `operator: ${entry.user_id.slice(0, 8)}` : "";
  const dt = new Date(entry.created_at);
  const timestamp = dt.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return {
    cls: meta.cls,
    icon: meta.icon,
    title: meta.title,
    description,
    actor,
    timestamp,
  };
}

const HEALTH_ICONS: Record<string, string> = {
  "API Gateway": "Globe",
  "Engine Workers": "Cpu",
  "Object Storage": "Server",
  "Email Delivery": "Mail",
};

export function mapHealthService(s: {
  name: string;
  state: string;
  value: string;
}): HealthService {
  return {
    name: s.name,
    icon: HEALTH_ICONS[s.name] ?? "Server",
    value: s.value,
    state: s.state as HealthService["state"],
  };
}

export function mapEngineVersion(v: {
  version: string;
  release_date: string;
  is_current: boolean;
  tenants_pinned: number;
  changelog: string[];
}): EngineVersion {
  return {
    version: v.version,
    releaseDate: v.release_date,
    isCurrent: v.is_current,
    tenantsPinned: v.tenants_pinned,
    changelog: v.changelog,
  };
}
