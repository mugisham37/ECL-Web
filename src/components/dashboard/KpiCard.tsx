import { HelpTooltip } from "./shared/HelpTooltip";
import { DeltaBadge } from "./shared/DeltaBadge";
import type { KpiData } from "@/lib/dashboard-types";

interface KpiCardProps extends KpiData {
  locked?: boolean;
  stale?: boolean;
}

export function KpiCard({
  label,
  helpText,
  currencyPrefix,
  value,
  delta,
  deltaDir,
  subNote,
  staleAsOf,
  locked = false,
  stale = false,
}: KpiCardProps) {
  return (
    <div className={`kpi${locked ? " locked" : ""}`}>
      {/* Label row */}
      <div className="kpi-label">
        {label}
        {helpText && <HelpTooltip text={helpText} />}
      </div>

      {/* Value */}
      <div className="kpi-value">
        {currencyPrefix && (
          <span className="kpi-cur">{currencyPrefix}</span>
        )}
        {value}
      </div>

      {/* Delta or stale notice */}
      {!locked && (
        <DeltaBadge
          delta={stale ? undefined : delta}
          deltaDir={stale ? undefined : deltaDir}
          staleAsOf={stale ? staleAsOf : undefined}
        />
      )}

      {/* Sub-note */}
      {subNote && !stale && (
        <span className="kpi-subnote">{subNote}</span>
      )}
    </div>
  );
}
