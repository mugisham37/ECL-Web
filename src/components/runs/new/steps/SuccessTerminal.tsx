"use client";

import { Check, Eye, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ResultKpiCard } from "../ResultKpiCard";
import { useRunWizard } from "../RunWizardContext";

export function SuccessTerminal() {
  const { state } = useRunWizard();
  const router = useRouter();
  const result = state.result;

  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="run-card run-terminal">
        <div className="rt-ic ok" aria-hidden="true">
          <Check size={24} />
        </div>
        <h2>Run complete</h2>
        <p
          className="rc-sub"
          style={{ maxWidth: "42ch", marginLeft: "auto", marginRight: "auto" }}
        >
          Your {state.runName} ECL has been computed and saved. Re-running these inputs on v1.0.3
          will reproduce it exactly.
        </p>

        <div className="result-kpis">
          <ResultKpiCard label="Total ECL" value={result.totalEcl.toLocaleString("en-US")} currencyPrefix={result.currency} />
          <ResultKpiCard label="Coverage ratio" value={result.coverageRatio} />
          <ResultKpiCard label="Run ID" value={result.id} copyable />
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => router.push(`/runs/${result.fullId}`)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              height: 44, padding: "0 20px",
              background: "var(--accent)", color: "#fff",
              border: "none", borderRadius: "var(--r-sm)",
              fontSize: "var(--fs-h3)", fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"],
              cursor: "pointer", transition: "background var(--t-micro)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--accent-hover)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--accent)")}
          >
            <Eye size={16} />
            View results
          </button>
          <button
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              height: 44, padding: "0 20px",
              background: "var(--surface)", color: "var(--text)",
              border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)",
              fontSize: "var(--fs-h3)", fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"],
              cursor: "pointer",
            }}
          >
            <Download size={16} />
            Download workbooks
          </button>
        </div>
      </div>
    </motion.div>
  );
}
