import { motion } from "framer-motion";
import { PdTransitionMatrix } from "./PdTransitionMatrix";
import { StageDistribution } from "./StageDistribution";
import { SegmentLoansTable } from "./SegmentLoansTable";
import { SkeletonBlock } from "@/components/dashboard/shared/SkeletonBlock";
import type { SegmentData, ExplorerFilter, LoanRow, PDMatrix } from "@/lib/results-types";

const EMPTY_MATRIX: PDMatrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

function fmtAmount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

interface SegmentViewProps {
  segment: SegmentData;
  filter: ExplorerFilter;
  isLoading: boolean;
  loans?: LoanRow[];
  pdMatrix?: PDMatrix;
  currency?: string;
  totalCount?: number;
  page?: number;
  totalPages?: number;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  onDrillLoan: (id: string) => void;
  onClearFilters: () => void;
}

export function SegmentView({
  segment,
  filter,
  isLoading,
  loans = [],
  pdMatrix = EMPTY_MATRIX,
  currency = "USD",
  totalCount,
  page = 1,
  totalPages = 1,
  onPrevPage,
  onNextPage,
  onDrillLoan,
  onClearFilters,
}: SegmentViewProps) {
  if (isLoading) {
    return (
      <div>
        <div className="rx-kpis k3" style={{ marginBottom: "var(--sp-4)" }}>
          {[...Array(3)].map((_, i) => (
            <SkeletonBlock key={i} height={88} className="skel-kpi" />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-4)", marginBottom: "var(--sp-4)" }}>
          <SkeletonBlock height={260} />
          <SkeletonBlock height={260} />
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <SkeletonBlock height={48} className="skel-row" />
          </div>
        ))}
      </div>
    );
  }

  const KPIS = [
    { label: "Segment ECL", cur: currency, value: fmtAmount(segment.ecl) },
    { label: "Coverage", cur: "", value: segment.coverage },
    { label: "Loans", cur: "", value: segment.loans.toLocaleString() },
  ];

  return (
    <div>
      {/* KPI strip */}
      <div className="rx-kpis k3">
        {KPIS.map((kpi, i) => (
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

      {/* Two-panel row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--sp-4)",
          marginBottom: "var(--sp-4)",
        }}
        className="seg-panel-grid"
      >
        {/* PD Matrix panel */}
        <motion.div
          className="rx-panel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rx-panel-head">
            <h3>PD transition matrix</h3>
            <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
              monthly · {segment.name}
            </span>
          </div>
          <div className="rx-panel-body">
            <PdTransitionMatrix matrix={pdMatrix} />
          </div>
        </motion.div>

        {/* Stage distribution panel */}
        <motion.div
          className="rx-panel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rx-panel-head">
            <h3>Stage distribution</h3>
            <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
              by exposure
            </span>
          </div>
          <div className="rx-panel-body">
            <StageDistribution mix={segment.mix} />
          </div>
        </motion.div>
      </div>

      {/* Loans table */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <h3 style={{ fontSize: "var(--fs-h3)", fontWeight: "var(--fw-semibold)" as React.CSSProperties["fontWeight"] }}>
          Loans · {segment.name}
        </h3>
        <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
          {segment.loans.toLocaleString()} loans
        </span>
      </div>
      <SegmentLoansTable
        loans={loans}
        filter={filter}
        totalCount={totalCount ?? segment.loans}
        currency={currency}
        page={page}
        totalPages={totalPages}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        onDrillLoan={onDrillLoan}
        onClearFilters={onClearFilters}
      />
    </div>
  );
}
