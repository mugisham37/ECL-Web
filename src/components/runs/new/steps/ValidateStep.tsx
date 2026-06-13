"use client";

import { useEffect, useState } from "react";
import { Info, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ValidationSummary } from "../ValidationSummary";
import { ValidationFileItem } from "../ValidationFileItem";
import { useRunWizard } from "../RunWizardContext";
import { useApiSession } from "@/hooks/use-api-session";
import { validateRun, uploadRunFile, deleteUpload } from "@/lib/api/runs";
import { mapValidationResult } from "@/lib/api/mappers";
import type { ValidationFileResult } from "@/lib/new-run-types";

export function ValidateStep() {
  const { state, dispatch } = useRunWizard();
  const { token, tenantId } = useApiSession();
  const [reuploadingId, setReuploadingId] = useState<string | null>(null);

  useEffect(() => {
    if (state.isValidating || state.validationResult || !state.runId || !token || !tenantId) return;

    dispatch({ type: "START_VALIDATING" });

    const uploadedFiles = [
      ...state.pdFiles,
      ...(state.lgdFile ? [state.lgdFile] : []),
      ...(state.eadFile ? [state.eadFile] : []),
    ];

    validateRun(token, tenantId, state.runId, {
      accepted_warning_ids: state.acceptedWarningIds,
    })
      .then((raw) => {
        const result = mapValidationResult(raw, uploadedFiles);
        dispatch({ type: "SET_VALIDATION_RESULT", result });
      })
      .catch((err: unknown) => {
        const subSummary =
          err instanceof Error
            ? err.message
            : "Could not connect to the server. Check your connection and try again.";
        dispatch({
          type: "SET_VALIDATION_RESULT",
          result: {
            status: "blocking",
            summary: "Validation failed",
            subSummary,
            fileResults: [],
          },
        });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.validationResult, state.isValidating, state.runId]);

  async function handleReupload(fileResult: ValidationFileResult, newFile: File) {
    const { file } = fileResult;
    setReuploadingId(file.id);
    try {
      if (file.backendUploadId) {
        await deleteUpload(token!, tenantId!, state.runId!, file.backendUploadId);
      }
      const result = await uploadRunFile(token!, tenantId!, state.runId!, file.type, newFile);
      dispatch({
        type: "UPDATE_FILE_STATUS",
        id: file.id,
        status: "ok",
        sheets: result.sheet_count ?? 0,
        hash: result.sha256 ? result.sha256.slice(0, 4) + "…" + result.sha256.slice(-4) : "—",
        backendUploadId: result.id,
      });
      dispatch({ type: "CLEAR_VALIDATION_RESULT" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Re-upload failed";
      dispatch({ type: "UPDATE_FILE_STATUS", id: file.id, status: "error", errorMessage: msg });
    } finally {
      setReuploadingId(null);
    }
  }

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

            {state.validationResult.fileResults.map((result) => (
              <ValidationFileItem
                key={result.file.id}
                result={result}
                zoneLabel={result.file.type}
                onReupload={(newFile) => handleReupload(result, newFile)}
                isReuploading={reuploadingId === result.file.id}
              />
            ))}

            {state.validationResult.status === "warn" && (
              <div className="callout callout-info" style={{ marginTop: "var(--sp-4)" }}>
                <Info size={15} className="ic" aria-hidden="true" />
                <span style={{ fontSize: "var(--fs-body)", color: "var(--text)" }}>
                  Warnings won&apos;t block your run, but blocking errors must be fixed and re-uploaded before you can continue.
                </span>
              </div>
            )}

            {state.validationResult.status === "blocking" && state.validationResult.fileResults.length === 0 && (
              <div style={{ marginTop: "var(--sp-4)", display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "CLEAR_VALIDATION_RESULT" })}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    height: 30, padding: "0 12px",
                    background: "none", border: "1px solid var(--border-strong)",
                    borderRadius: "var(--r-sm)", fontSize: "var(--fs-caption)",
                    color: "var(--text)", cursor: "pointer",
                  }}
                >
                  <RefreshCw size={13} aria-hidden="true" />
                  Retry validation
                </button>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
