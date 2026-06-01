import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { KpiData } from "@/lib/dashboard-types";

interface DeltaBadgeProps {
  delta?: number;
  deltaDir?: KpiData["deltaDir"];
  staleAsOf?: string;
}

export function DeltaBadge({ delta, deltaDir, staleAsOf }: DeltaBadgeProps) {
  if (staleAsOf) {
    return (
      <span className="delta delta-stale">
        as of {staleAsOf}
      </span>
    );
  }

  if (delta === undefined || !deltaDir) return null;

  const isFlat = deltaDir === "flat";
  const isUp = deltaDir === "up";
  const className = `delta delta-${deltaDir}`;

  const formatted =
    isFlat
      ? "—"
      : Math.abs(delta) < 1
      ? `${isUp ? "+" : ""}${delta.toFixed(2)}pp`
      : `${isUp ? "+" : ""}${delta.toFixed(1)}%`;

  return (
    <span className={className}>
      {deltaDir === "up" && <TrendingUp size={12} />}
      {deltaDir === "down" && <TrendingDown size={12} />}
      {deltaDir === "flat" && <Minus size={12} />}
      {formatted}
    </span>
  );
}
