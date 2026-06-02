interface TrendLineChartProps {
  points: number[];
  width?: number;
  height?: number;
  label?: string;
}

export function TrendLineChart({ points, width = 640, height = 180, label = "Trend chart" }: TrendLineChartProps) {
  const pad = 24;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((v, i) => [
    pad + (i / (points.length - 1)) * (width - pad * 2),
    height - pad - ((v - min) / range) * (height - pad * 2),
  ]);

  const path = coords.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

  const gridRows = 4;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="img"
      aria-label={label}
      style={{ display: "block" }}
    >
      {/* grid lines */}
      {Array.from({ length: gridRows }, (_, i) => {
        const y = pad + (i / (gridRows - 1)) * (height - pad * 2);
        return (
          <line
            key={i}
            x1={pad} x2={width - pad}
            y1={y.toFixed(0)} y2={y.toFixed(0)}
            stroke="var(--border)"
            strokeWidth={1}
          />
        );
      })}

      {/* line */}
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeLinejoin="round" />

      {/* dots */}
      {coords.map((p, i) => (
        <circle key={i} cx={p[0].toFixed(1)} cy={p[1].toFixed(1)} r={2.5} fill="var(--accent)" />
      ))}
    </svg>
  );
}
