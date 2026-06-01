import { SkeletonBlock } from "./shared/SkeletonBlock";

export function LoadingSkeleton() {
  return (
    <div aria-label="Loading dashboard" aria-busy="true">
      {/* KPI strip skeleton */}
      <div className="kpi-strip" style={{ marginBottom: "var(--sp-5)" }}>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBlock key={i} height={96} className="skel-kpi" />
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="dash-grid" style={{ marginBottom: "var(--sp-5)" }}>
        <div
          className="chart-card cc-body"
          style={{ height: 260 }}
        >
          <SkeletonBlock height="100%" />
        </div>
        <div
          className="chart-card cc-body"
          style={{ height: 260 }}
        >
          <SkeletonBlock height="100%" />
        </div>
      </div>

      {/* Trend skeleton */}
      <div
        className="chart-card cc-body"
        style={{ height: 120, marginBottom: "var(--sp-5)" }}
      >
        <SkeletonBlock height="100%" />
      </div>

      {/* Runs table skeleton */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <SkeletonBlock height={16} width="28%" className="skel-line" />
        <SkeletonBlock height={160} />
      </div>
    </div>
  );
}
