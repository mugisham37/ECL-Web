import { TrendingUp, TrendingDown } from "lucide-react";

interface ResultsDeltaBadgeProps {
  delta: number; // +/- %
}

export function ResultsDeltaBadge({ delta }: ResultsDeltaBadgeProps) {
  const isUp   = delta > 0;
  const isDown = delta < 0;

  const cls = isUp ? "delta delta-up" : isDown ? "delta delta-down" : "delta delta-flat";
  const sign = isUp ? "+" : isDown ? "−" : "";
  const abs = Math.abs(delta).toFixed(1);

  return (
    <span className={cls}>
      {isUp   && <TrendingUp   size={12} aria-hidden />}
      {isDown && <TrendingDown size={12} aria-hidden />}
      {sign}{abs}%
    </span>
  );
}
