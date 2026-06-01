"use client";

import { useEffect } from "react";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ValidationSummary } from "../ValidationSummary";
import { ValidationFileItem } from "../ValidationFileItem";
import { useRunWizard } from "../RunWizardContext";
import type { ValidationResult } from "@/lib/new-run-types";

// ── Simulate validation ────────────────────────────────────────────────────

function buildValidationResult(state: ReturnType<typeof useRunWizard>["state"]): ValidationResult {
  const allFiles = [
    ...state.pdFiles.map((f) => ({ zone: "PD", file: f })),
    ...(state.lgdFile ? [{ zone: "LGD", file: state.lgdFile }] : []),
    ...(state.eadFile ? [{ zone: "EAD", file: state.eadFile }] : []),
  ];

  const fileResults = allFiles.map(({ file }) => {
    if (file.name === "PD_branch4.xlsx") {
      return {
        file,
        issues: [
          { level: "warn" as const, title: 'Unknown segment "Microfinance"', location: "Sheet 1 · column F · 14 rows", fix: 'Rows will be grouped under "Unsegmented" unless you add the segment in Admin.' },
          { level: "warn" as const, title: "Blank maturity date", location: "Sheet 1 · column M · 3 rows", fix: "These loans default to the portfolio average maturity." },
          { level: "warn" as const, title: "Negative outstanding balance", location: "Sheet 1 · column J · 1 row", fix: "Treated as zero exposure." },
        ],
      };
    }
    return { file, issues: [] };
  });

  const hasWarn = fileResults.some((r) => r.issues.length > 0);
  const warnCount = fileResults.filter((r) => r.issues.length > 0).length;
  const okCount = fileResults.length - warnCount;

  if (hasWarn) {
    return {
      status: "warn",
      summary: `${okCount} file${okCount !== 1 ? "s" : ""} valid · 1 file with 3 warnings`,
      subSummary: "Warnings won't block the run. Review them below.",
      fileResults,
    };
  }
  return {
    status: "ok",
    summary: `All ${fileResults.length} files valid`,
    subSummary: "No issues found. Ready to compute.",
    fileResults,
  };
}

export function ValidateStep() {
  const { state, dispatch } = useRunWizard();

  useEffect(() => {
    if (!state.isValidating && !state.validationResult) {
      dispatch({ type: "START_VALIDATING" });
      const t = setTimeout(() => {
        dispatch({ type: "SET_VALIDATION_RESULT", result: buildValidationResult(state) });
      }, 1400);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AnimatePresence mode="wait">
        {state.isValidating ? (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="run-card">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span
                  style={{ width: 22, height: 22, borderRadius: "50%", border: "2.5px solid var(--accent-border)", borderTopColor: "var(--accent)", animation: "spin 0.7s linear infinite", flexShrink: 0 }}
                  aria-hidden="true"
                />
                <div>
                  <div style={{ fontWeight: "var(--fw-semibold)" as React.CSSProperties["fontWeight"], color: "var(--text)", fontSize: "var(--fs-body)" }}>
                    Validating your files…
                  </div>
                  <div className="rc-sub">Checking columns, types and reference values.</div>
                </div>
              </div>
              <div className="progress indeterminate" style={{ marginTop: 16 }}>
                <div className="bar" />
              </div>
            </div>
          </motion.div>
        ) : state.validationResult ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ValidationSummary result={state.validationResult} />

            {state.validationResult.fileResults.map((result, i) => (
              <ValidationFileItem
                key={result.file.id}
                result={result}
                zoneLabel={result.file.type}
              />
            ))}

            <div className="callout callout-info" style={{ marginTop: "var(--sp-4)" }}>
              <Info size={15} className="ic" aria-hidden="true" />
              <span style={{ fontSize: "var(--fs-body)", color: "var(--text)" }}>
                Warnings won&apos;t block your run, but blocking errors must be fixed and re-uploaded before you can continue.
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
