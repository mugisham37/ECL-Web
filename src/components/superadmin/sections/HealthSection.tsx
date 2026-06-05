import { FlaskConical } from "lucide-react";
import { SkeletonBlock } from "@/components/dashboard/shared/SkeletonBlock";
import { HealthCard } from "../atoms/HealthCard";
import { QueueBar } from "../atoms/QueueBar";
import { AuditEvent } from "../atoms/AuditEvent";
import type { HealthService, AuditEntry } from "@/lib/superadmin-types";

interface HealthSectionProps {
  isDegraded: boolean;
  normalServices: HealthService[];
  normalErrors: AuditEntry[];
  degradedErrors: AuditEntry[];
  onToggleDegrade?: () => void;
  queueStats?: { running: number; queued: number; avg_wait_seconds: number };
  isLoading: boolean;
}

export function HealthSection({
  isDegraded,
  normalServices,
  normalErrors,
  degradedErrors,
  onToggleDegrade,
  queueStats,
  isLoading,
}: HealthSectionProps) {
  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <SkeletonBlock height={28} width={160} />
        <div className="health-grid">
          {[...Array(4)].map((_, i) => <SkeletonBlock key={i} height={76} />)}
        </div>
        <SkeletonBlock height={100} />
        <SkeletonBlock height={120} />
      </div>
    );
  }

  const services: HealthService[] = isDegraded
    ? normalServices.map((s, i) => ({
        ...s,
        state: i === 1 ? ("down" as const) : i === 0 ? ("warn" as const) : s.state,
      }))
    : normalServices;

  const running = queueStats?.running ?? (isDegraded ? 3 : 8);
  const queued  = queueStats?.queued ?? (isDegraded ? 14 : 3);
  const totalBars = 22;
  const errors  = isDegraded ? degradedErrors : normalErrors;

  return (
    <div>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--sp-4)", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: "var(--fw-semibold)" as string }}>System health</h2>
          {!isDegraded && (
            <span
              className="pill pill-success"
              style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              <span className="dot" />
              99.98% uptime · 30d
            </span>
          )}
          {isDegraded && (
            <span className="pill pill-danger" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span className="dot" />
              Incident active
            </span>
          )}
        </div>

        {onToggleDegrade && (
        <button
          onClick={onToggleDegrade}
          style={{
            height: 28, padding: "0 10px",
            border: "1px dashed var(--border-strong)",
            borderRadius: "var(--r-sm)",
            background: "transparent",
            color: "var(--text-subtle)",
            fontSize: "var(--fs-caption)",
            cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 5,
          }}
          aria-pressed={isDegraded}
          title="Prototype: toggle degraded state"
        >
          <FlaskConical size={12} aria-hidden />
          {isDegraded ? "Restore normal" : "Simulate incident"}
        </button>
        )}
      </div>

      {/* health cards */}
      <div className="health-grid">
        {services.map((s) => (
          <HealthCard key={s.name} service={s} />
        ))}
      </div>

      {/* queue card */}
      <div
        className="card"
        style={{ padding: "18px 20px", marginBottom: "var(--sp-5)" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div className="card-title">Run queue</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
              <span
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: isDegraded ? "var(--warning)" : "var(--success)",
                  animation: "ledPulse 1.5s ease-in-out infinite",
                }}
              />
              Live
            </span>
            <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
              {isDegraded
                ? "3 running · 27 queued · avg wait 4m 30s"
                : "8 running · 3 queued · avg wait 12s"}
            </span>
          </div>
        </div>
        <QueueBar running={running} queued={queued} total={totalBars} />
      </div>

      {/* error feed */}
      <div className="card" style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div className="card-title">Recent errors</div>
          <span style={{ fontSize: "var(--fs-caption)", color: isDegraded ? "var(--danger)" : "var(--text-muted)" }}>
            {isDegraded ? "3 active · last 1h" : "Last 24h"}
          </span>
        </div>
        {errors.map((e, i) => (
          <AuditEvent key={i} entry={e} />
        ))}
      </div>
    </div>
  );
}
