import type { StageMix } from "@/lib/results-types";

const STAGE_COLORS = [
  "var(--chart-8)", // Stage 1 — muted blue-gray
  "var(--chart-3)", // Stage 2 — amber
  "var(--chart-7)", // Stage 3 — coral
] as const;

interface StageMixBarProps {
  mix: StageMix;
}

export function StageMixBar({ mix }: StageMixBarProps) {
  return (
    <span
      className="seg-mix-bar"
      title={`Stage 1: ${mix[0]}% · Stage 2: ${mix[1]}% · Stage 3: ${mix[2]}%`}
    >
      {mix.map((pct, i) => (
        <span
          key={i}
          style={{ width: `${pct}%`, background: STAGE_COLORS[i] }}
        />
      ))}
    </span>
  );
}
