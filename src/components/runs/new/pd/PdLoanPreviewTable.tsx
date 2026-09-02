"use client";

import { motion } from "framer-motion";
import { StageBadge } from "@/components/results/shared/StageBadge";
import { NextStageCell } from "./NextStageCell";
import type { PdLoanPreviewRow } from "@/lib/new-run-types";

export const PD_LOAN_PAGE_SIZE = 6;

interface PdLoanPreviewTableProps {
  rows: PdLoanPreviewRow[];
  totalCount: number;
  page: number;
  totalPages: number;
  sortKey: "loanId" | "reportingMonth";
  sortDir: "asc" | "desc";
  onSort: (key: "loanId" | "reportingMonth") => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSelectLoan: (loanId: string) => void;
}

export function PdLoanPreviewTable({
  rows,
  totalCount,
  page,
  totalPages,
  sortKey,
  sortDir,
  onSort,
  onPrevPage,
  onNextPage,
  onSelectLoan,
}: PdLoanPreviewTableProps) {
  function ariaSort(key: "loanId" | "reportingMonth"): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <div>
      <div className="tbl-wrap pd-loan-table" data-density="compact">
        <table className="tbl pd-loan-table" aria-label="PD loan-level preview">
          <thead>
            <tr>
              <th className="sortable" aria-sort={ariaSort("loanId")}>
                <button type="button" className="loan-sort" onClick={() => onSort("loanId")}>
                  Loan ID
                </button>
              </th>
              <th>Segment</th>
              <th className="sortable" aria-sort={ariaSort("reportingMonth")}>
                <button type="button" className="loan-sort" onClick={() => onSort("reportingMonth")}>
                  Reporting month
                </button>
              </th>
              <th>Staging</th>
              <th>Next month staging</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <motion.tr
                key={`${row.loanId}-${row.reportingMonthKey}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
              >
                <td className="mono" data-label="Loan ID">
                  <button
                    type="button"
                    className="loan-link"
                    onClick={() => onSelectLoan(row.loanId)}
                  >
                    {row.loanId}
                  </button>
                </td>
                <td data-label="Segment">{row.segment}</td>
                <td className="mono" data-label="Reporting month">{row.reportingMonth}</td>
                <td data-label="Staging">
                  <StageBadge stage={row.staging} />
                </td>
                <td data-label="Next month staging">
                  <NextStageCell stage={row.nextStaging} isFinalMonth={row.isFinalMonth} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <div className="tbl-foot">
          <span>
            Showing {rows.length} of {totalCount.toLocaleString()}
            {sortKey === "reportingMonth" ? " · sorted by Reporting month" : " · sorted by Loan ID"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              className="fbtn"
              disabled={page <= 1}
              onClick={onPrevPage}
              style={{ height: 30, padding: "0 10px", opacity: page <= 1 ? 0.5 : 1 }}
            >
              Prev
            </button>
            <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="fbtn"
              disabled={page >= totalPages}
              onClick={onNextPage}
              style={{ height: 30, padding: "0 10px", opacity: page >= totalPages ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
