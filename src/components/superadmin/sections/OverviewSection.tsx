import { ArrowRight } from "lucide-react";
import { SkeletonBlock } from "@/components/dashboard/shared/SkeletonBlock";
import { TrendLineChart } from "../atoms/TrendLineChart";
import { AuditEvent } from "../atoms/AuditEvent";
import type { TenantRecord, AuditEntry } from "@/lib/superadmin-types";

interface OverviewSectionProps {
  tenants: TenantRecord[];
  auditEntries: AuditEntry[];
  isLoading: boolean;
  onNavigate: (section: "audit") => void;
  uptime?: string;
  trendPoints?: number[];
  runsThisMonth?: number;
  runsToday?: number;
  mrrTotal?: number;
}

const DEFAULT_TREND = [120, 135, 128, 142, 155, 138, 90, 95, 160, 148, 152, 144, 158, 147];

export function OverviewSection({
  tenants,
  auditEntries,
  isLoading,
  onNavigate,
  uptime = "99.98%",
  trendPoints,
  runsThisMonth,
  runsToday,
  mrrTotal,
}: OverviewSectionProps) {
  if (isLoading) {
    return (
      <div>
        <div className="op-kpis">
          {[...Array(4)].map((_, i) => <SkeletonBlock key={i} height={88} />)}
        </div>
        <div className="op-grid">
          <SkeletonBlock height={220} />
          <SkeletonBlock height={220} />
        </div>
        <SkeletonBlock height={180} />
      </div>
    );
  }

  const active    = tenants.filter((t) => t.status === "active").length;
  const trial     = tenants.filter((t) => t.status === "trial").length;
  const suspended = tenants.filter((t) => t.status === "suspended").length;
  const totalMrr  = mrrTotal ?? tenants.reduce((s, t) => s + t.mrr, 0);
  const totalRuns = runsThisMonth ?? tenants.reduce((s, t) => s + t.runs, 0);
  const trend = trendPoints ?? DEFAULT_TREND;

  const planData: Array<[string, number, string]> = [
    ["Starter",    tenants.filter((t) => t.plan === "Starter").length,    "var(--text-subtle)"],
    ["Growth",     tenants.filter((t) => t.plan === "Growth").length,     "var(--accent)"],
    ["Enterprise", tenants.filter((t) => t.plan === "Enterprise").length, "#B364C9"],
  ];
  const total = tenants.length || 1;
  const C = 2 * Math.PI * 50;
  let arcOffset = 0;

  return (
    <div>
      {/* KPI strip */}
      <div className="op-kpis">
        <div className="kpi">
          <div className="kpi-label">Tenants</div>
          <div className="kpi-value">{tenants.length}</div>
          <div className="kpi-split">
            <span className="ks"><span className="dot" style={{ background: "var(--success)" }} />{active} active</span>
            <span className="ks"><span className="dot" style={{ background: "var(--warning)" }} />{trial} trial</span>
            <span className="ks"><span className="dot" style={{ background: "var(--danger)" }} />{suspended} susp.</span>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-label">MRR</div>
          <div className="kpi-value">
            <span className="kpi-cur">USD</span>
            ${totalMrr.toLocaleString("en-US")}
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-label">Runs this month</div>
          <div className="kpi-value">{totalRuns.toLocaleString("en-US")}</div>
          <div className="kpi-subnote">{runsToday ?? Math.round(totalRuns / 27)} today</div>
        </div>

        <div className="kpi">
          <div className="kpi-label">Uptime · 30d</div>
          <div className="kpi-value">{uptime}</div>
        </div>
      </div>

      {/* Overview grid */}
      <div className="op-grid">
        {/* Trend chart */}
        <div className="card" style={{ padding: 20 }}>
          <div className="card-head" style={{ marginBottom: 12 }}>
            <div className="card-title">Runs across platform</div>
            <div className="card-sub">14 days · all tenants</div>
          </div>
          <TrendLineChart points={trend} label="Platform run trend over 14 days" />
        </div>

        {/* Donut chart */}
        <div className="card" style={{ padding: 20 }}>
          <div className="card-head" style={{ marginBottom: 12 }}>
            <div className="card-title">Tenants by plan</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <svg viewBox="0 0 136 136" width={120} height={120} aria-label="Tenant plan distribution" role="img">
              {planData.map(([, v, c]) => {
                const len = (v / total) * C;
                const el = (
                  <circle
                    key={c}
                    cx="68" cy="68" r="50"
                    fill="none"
                    stroke={c}
                    strokeWidth="15"
                    strokeDasharray={`${len} ${C - len}`}
                    strokeDashoffset={-arcOffset}
                    transform="rotate(-90 68 68)"
                  />
                );
                arcOffset += len;
                return el;
              })}
              <text x="68" y="64" textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontFamily="var(--font-ui)">Tenants</text>
              <text x="68" y="82" textAnchor="middle" fontSize="17" fill="var(--text)" fontFamily="var(--font-mono)" fontWeight="500">{tenants.length}</text>
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {planData.map(([label, count, color]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: "var(--fs-body)" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
                  <span style={{ width: 84 }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div className="card-title">Recent platform activity</div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onNavigate("audit")}
            style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--fs-caption)" }}
          >
            View all <ArrowRight size={12} aria-hidden />
          </button>
        </div>
        <div>
          {auditEntries.slice(0, 4).map((entry, i) => (
            <AuditEvent key={i} entry={entry} showActor />
          ))}
        </div>
      </div>
    </div>
  );
}
