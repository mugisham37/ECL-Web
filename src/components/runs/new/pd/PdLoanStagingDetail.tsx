"use client";

import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { StageBadge } from "@/components/results/shared/StageBadge";
import { NextStageCell } from "./NextStageCell";
import type { PdLoanPreviewRow } from "@/lib/new-run-types";

interface PdLoanStagingDetailProps {
  loanId: string;
  rows: PdLoanPreviewRow[];
  index: number;
  total: number;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function PdLoanStagingDetail({
  loanId,
  rows,
  index,
  total,
  onBack,
  onPrev,
  onNext,
}: PdLoanStagingDetailProps) {
  const latest = rows[rows.length - 1];
  const segment = latest?.segment ?? rows[0]?.segment ?? "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <button
          type="button"
          className="fbtn"
          onClick={onBack}
          style={{ height: 36, padding: "0 12px" }}
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back
        </button>
        <div className="loan-id-head" style={{ marginBottom: 0, flex: 1 }}>
          <h2 style={{ margin: 0 }}>{loanId}</h2>
          {latest ? <StageBadge stage={latest.staging} /> : null}
          {segment ? <span className="rx-tag">{segment}</span> : null}
        </div>
        <div className="pd-loan-nav">
          <button
            type="button"
            className="fbtn"
            onClick={onPrev}
            disabled={index <= 0}
            aria-label="Previous loan"
            style={{ opacity: index <= 0 ? 0.5 : 1 }}
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Previous
          </button>
          <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {index + 1} / {total}
          </span>
          <button
            type="button"
            className="fbtn"
            onClick={onNext}
            disabled={index >= total - 1}
            aria-label="Next loan"
            style={{ opacity: index >= total - 1 ? 0.5 : 1 }}
          >
            Next
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="tbl-wrap pd-loan-table" data-density="compact">
        <table className="tbl pd-loan-table" aria-label={`Staging history for ${loanId}`}>
          <thead>
            <tr>
              <th>Reporting month</th>
              <th>Staging</th>
              <th>Next month staging</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.reportingMonthKey}>
                <td className="mono" data-label="Reporting month">{row.reportingMonth}</td>
                <td data-label="Staging"><StageBadge stage={row.staging} /></td>
                <td data-label="Next month staging">
                  <NextStageCell stage={row.nextStaging} isFinalMonth={row.isFinalMonth} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
