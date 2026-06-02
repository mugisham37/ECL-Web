import { motion } from "framer-motion";
import { SegmentsTable } from "./SegmentsTable";
import { SkeletonBlock } from "@/components/dashboard/shared/SkeletonBlock";
import { fmtKes, PORTFOLIO_TOTALS } from "@/lib/results-mock";
import type { SegmentData } from "@/lib/results-types";

const PORTFOLIO_KPIS = [
  { label: "Total ECL",        cur: "KES", value: fmtKes(PORTFOLIO_TOTALS.ecl) },
  { label: "Coverage ratio",   cur: "",    value: "2.41%" },
  { label: "Total outstanding",cur: "KES", value: "57.4M" },
  { label: "Loans analysed",   cur: "",    value: PORTFOLIO_TOTALS.loans.toLocaleString() },
];

interface PortfolioViewProps {
  segments: SegmentData[];
  isLoading: boolean;
  onDrillSegment: (name: string) => void;
}

export function PortfolioView({ segments, isLoading, onDrillSegment }: PortfolioViewProps) {
  if (isLoading) {
    return (
      <div>
        <div className="rx-kpis" style={{ marginBottom: "var(--sp-4)" }}>
          {[...Array(4)].map((_, i) => (
            <SkeletonBlock key={i} height={88} className="skel-kpi" />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[...Array(7)].map((_, i) => (
            <SkeletonBlock key={i} height={48} className="skel-row" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* KPI strip */}
      <div className="rx-kpis">
        {PORTFOLIO_KPIS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="kpi"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">
              {kpi.cur && <span className="kpi-cur">{kpi.cur}</span>}
              {kpi.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Segment table */}
      <SegmentsTable segments={segments} onDrillSegment={onDrillSegment} />
    </div>
  );
}
