import { BarChart3 } from "lucide-react";
import { BarChart } from "@/components/dashboard/BarChart";
import type { RunDetail } from "@/lib/runs-types";

interface OverviewTabProps {
  run: RunDetail;
}

export function OverviewTab({ run }: OverviewTabProps) {
  return (
    <div>
      <div className="ov-grid">
        {/* ECL by segment bar chart */}
        <div className="chart-card">
          <div className="cc-head">
            <h3>ECL by segment</h3>
            <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>KES</span>
          </div>
          <div className="cc-body">
            <BarChart data={run.segments} />
          </div>
        </div>

        {/* Summary narrative */}
        <div className="ov-summary">
          <h3>What this run says</h3>
          <p>
            Total Expected Credit Loss of{" "}
            <strong>KES 1,284,500</strong> across 7 segments and 11,847 loans, a{" "}
            <span style={{ color: "var(--success)" }}>+4.2%</span> increase from April — driven mainly by
            Stage 2 migration in Transport.
          </p>

          <div className="ov-stat">
            <span className="k">Highest ECL segment</span>
            <span className="v">Transport · 318k</span>
          </div>
          <div className="ov-stat">
            <span className="k">Stage 3 share</span>
            <span className="v">15%</span>
          </div>
          <div className="ov-stat">
            <span className="k">Lifetime ECL share</span>
            <span className="v">42%</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
        <button
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            height: "var(--control-h)", padding: "0 14px",
            background: "var(--accent)", color: "#fff",
            border: "none", borderRadius: "var(--r-sm)",
            fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"],
            cursor: "pointer", transition: "background var(--t-micro)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--accent-hover)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--accent)")}
        >
          <BarChart3 size={14} />
          Open in Results Explorer
        </button>
      </div>
    </div>
  );
}
