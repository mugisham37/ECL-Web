import { KpiStrip } from "@/components/dashboard/KpiStrip";
import type { RunDetail } from "@/lib/runs-types";

interface RunDetailKpiStripProps {
  run: RunDetail;
}

export function RunDetailKpiStrip({ run }: RunDetailKpiStripProps) {
  const isPending = run.status === "running" || run.status === "failed";

  return (
    <div className="detail-kpis">
      {run.kpis.map((kpi, i) => (
        <div
          key={kpi.id}
          className={`kpi${isPending ? " locked" : ""}`}
          style={{ opacity: isPending ? 0.55 : 1 }}
        >
          <div className="kpi-label">{kpi.label}</div>
          <div className="kpi-value">
            {kpi.currencyPrefix && <span className="kpi-cur">{kpi.currencyPrefix}</span>}
            {kpi.value}
          </div>
          {kpi.subNote && !isPending && (
            <span className="kpi-subnote">{kpi.subNote}</span>
          )}
        </div>
      ))}
    </div>
  );
}
