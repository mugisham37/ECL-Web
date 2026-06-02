import type { TenantRecord, PlatformUser, HealthService, EngineVersion, AuditEntry } from "./superadmin-types";

export const MOCK_TENANTS: TenantRecord[] = [
  { id: "t1", name: "Savanna Bank PLC",   mark: "SB", color: "var(--accent)",  plan: "Growth",     status: "active",    users: 14, runs: 8,  created: "Jan 2026", mrr: 3500  },
  { id: "t2", name: "Acacia MFI",         mark: "AC", color: "#D79320",        plan: "Starter",    status: "active",    users: 5,  runs: 4,  created: "Feb 2026", mrr: 1200  },
  { id: "t3", name: "Rift Valley Trust",  mark: "RV", color: "#2BB6C9",        plan: "Enterprise", status: "active",    users: 38, runs: 22, created: "Nov 2025", mrr: 9800  },
  { id: "t4", name: "Karibu Finance",     mark: "KF", color: "#6D4AFF",        plan: "Growth",     status: "trial",     users: 7,  runs: 2,  created: "May 2026", mrr: 0     },
  { id: "t5", name: "Baobab Credit",      mark: "BC", color: "#2C9A63",        plan: "Starter",    status: "active",    users: 4,  runs: 3,  created: "Mar 2026", mrr: 1200  },
  { id: "t6", name: "Meridian Bank",      mark: "MB", color: "#B364C9",        plan: "Enterprise", status: "active",    users: 51, runs: 31, created: "Aug 2025", mrr: 12500 },
  { id: "t7", name: "Tumaini SACCO",      mark: "TS", color: "#DD6A52",        plan: "Starter",    status: "trial",     users: 3,  runs: 1,  created: "May 2026", mrr: 0     },
  { id: "t8", name: "Zahara Microbank",   mark: "ZM", color: "#4F7FE0",        plan: "Growth",     status: "suspended", users: 9,  runs: 0,  created: "Dec 2025", mrr: 0     },
];

export const MOCK_PLATFORM_USERS: PlatformUser[] = [
  { name: "Tendai Mwangi",  email: "t.mwangi@savannabank.co.ke",  tenant: "Savanna Bank PLC",  role: "Admin",    status: "active",   lastActive: "2 min ago"  },
  { name: "A. Karanja",     email: "a.karanja@savannabank.co.ke", tenant: "Savanna Bank PLC",  role: "Admin",    status: "active",   lastActive: "1 h ago"    },
  { name: "Fatuma Said",    email: "f.said@rvtrust.co.ke",        tenant: "Rift Valley Trust", role: "Analyst",  status: "active",   lastActive: "20 min ago" },
  { name: "Daniel Kim",     email: "d.kim@meridian.com",          tenant: "Meridian Bank",     role: "Reviewer", status: "active",   lastActive: "3 h ago"    },
  { name: "P. Njoroge",     email: "p.njoroge@acacia.co.ke",      tenant: "Acacia MFI",        role: "Admin",    status: "disabled", lastActive: "12 days ago"},
  { name: "Grace Wanjiru",  email: "g.wanjiru@savannabank.co.ke", tenant: "Savanna Bank PLC",  role: "Reviewer", status: "active",   lastActive: "3 days ago" },
];

export const MOCK_HEALTH_SERVICES: HealthService[] = [
  { name: "API gateway",    icon: "Globe",  value: "142ms p95",  state: "ok" },
  { name: "Engine workers", icon: "Cpu",    value: "8 / 12 busy",state: "ok" },
  { name: "Object storage", icon: "Server", value: "1.2 TB",     state: "ok" },
  { name: "Email delivery", icon: "Mail",   value: "99.9% sent", state: "ok" },
];

export const MOCK_ENGINES: EngineVersion[] = [
  {
    version: "v1.0.3", releaseDate: "2 Apr 2026", isCurrent: true, tenantsPinned: 22,
    changelog: [
      "Stable cure-rate calculation for sparse segments",
      "Faster matrix exponentiation (299 powers)",
      "Deterministic float summation order",
    ],
  },
  {
    version: "v1.0.2", releaseDate: "11 Feb 2026", isCurrent: false, tenantsPinned: 2,
    changelog: [
      "Collateral proportioning fix for multi-loan customers",
      "EAD rundown edge case at maturity",
    ],
  },
  {
    version: "v1.0.1", releaseDate: "3 Jan 2026", isCurrent: false, tenantsPinned: 0,
    changelog: ["Initial GA release"],
  },
];

export const MOCK_AUDIT: AuditEntry[] = [
  { cls: "accent", icon: "Rocket",        title: "Tenant provisioned",    description: "Karibu Finance · Growth · 14-day trial",       actor: "operator: j.ops",      timestamp: "30 May 11:20" },
  { cls: "err",    icon: "Ban",           title: "Tenant suspended",      description: "Zahara Microbank · non-payment",               actor: "operator: a.billing",  timestamp: "28 May 09:05" },
  { cls: "accent", icon: "Fingerprint",   title: "Impersonation started", description: "Rift Valley Trust · support ticket #4821",     actor: "operator: s.support",  timestamp: "27 May 14:32" },
  { cls: "",       icon: "Fingerprint",   title: "Impersonation ended",   description: "Rift Valley Trust · 11 min session",           actor: "operator: s.support",  timestamp: "27 May 14:43" },
  { cls: "ok",     icon: "Cpu",           title: "Engine promoted to default", description: "v1.0.3 · 22 tenants affected",           actor: "operator: j.ops",      timestamp: "2 Apr 10:00"  },
  { cls: "",       icon: "Users",         title: "User force-reset",      description: "p.njoroge@acacia.co.ke · lost device",         actor: "operator: s.support",  timestamp: "18 Apr 16:11" },
];

export const MOCK_HEALTH_ERRORS_NORMAL: AuditEntry[] = [
  { cls: "",    icon: "AlertTriangle", title: "Validation rejected · Acacia MFI",  description: "Unknown collateral type in upload", actor: "", timestamp: "38 min ago" },
  { cls: "err", icon: "X",            title: "Run failed · Rift Valley Trust",     description: "Unmapped segment · tenant notified", actor: "", timestamp: "2 h ago"    },
];

export const MOCK_HEALTH_ERRORS_DEGRADED: AuditEntry[] = [
  { cls: "err", icon: "AlertTriangle", title: "Engine worker pool unresponsive", description: "3 workers failed health check · auto-scaling triggered", actor: "", timestamp: "just now"  },
  { cls: "err", icon: "AlertTriangle", title: "Run queue backing up",            description: "27 runs queued across 6 tenants",                       actor: "", timestamp: "2 min ago" },
  { cls: "",    icon: "X",             title: "Run failed · Meridian Bank",      description: "Worker timeout · auto-retry scheduled",                  actor: "", timestamp: "4 min ago" },
];
