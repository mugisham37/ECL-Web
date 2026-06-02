import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { StageBadge } from "../shared/StageBadge";
import { ResultsEmptyState } from "../shared/ResultsEmptyState";
import { fmtKes } from "@/lib/results-mock";
import type { LoanRow, ExplorerFilter } from "@/lib/results-types";

interface SegmentLoansTableProps {
  loans: LoanRow[];
  filter: ExplorerFilter;
  totalCount: number;
  onDrillLoan: (id: string) => void;
  onClearFilters: () => void;
}

export function SegmentLoansTable({
  loans,
  filter,
  totalCount,
  onDrillLoan,
  onClearFilters,
}: SegmentLoansTableProps) {
  const filtered = loans.filter((loan) => {
    const stageOk = filter.stageFilters[loan.stage - 1];
    const q = filter.search.toLowerCase();
    const searchOk = !q || loan.id.toLowerCase().includes(q) || loan.customer.toLowerCase().includes(q);
    return stageOk && searchOk;
  });

  if (filtered.length === 0) {
    return <ResultsEmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <div>
      <div className="tbl-wrap">
        <table className="tbl rx-table" aria-label="Loans">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Customer</th>
              <th>Stage</th>
              <th className="num">PD (12m)</th>
              <th className="num">LGD</th>
              <th className="num">EAD (KES)</th>
              <th className="num" aria-sort="descending">ECL (KES)</th>
              <th aria-label="Drill" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((loan, i) => (
              <motion.tr
                key={loan.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => onDrillLoan(loan.id)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span className="loan-link" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)" }}>
                    {loan.id}
                  </span>
                </td>
                <td>{loan.customer}</td>
                <td>
                  <StageBadge stage={loan.stage} />
                </td>
                <td className="num">{loan.pd.toFixed(1)}%</td>
                <td className="num">{loan.lgd.toFixed(1)}%</td>
                <td className="num">{fmtKes(loan.ead)}</td>
                <td className="num" style={{ fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"] }}>
                  {fmtKes(loan.ecl)}
                </td>
                <td className="num">
                  <ChevronRight size={14} style={{ color: "var(--text-subtle)" }} aria-hidden />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tbl-foot">
        <span>Showing {filtered.length} of {totalCount.toLocaleString()}</span>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            className="fbtn"
            disabled
            style={{ height: 30, padding: "0 10px", opacity: 0.5 }}
          >
            Prev
          </button>
          <button
            className="fbtn"
            disabled
            style={{ height: 30, padding: "0 10px", opacity: 0.5 }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
