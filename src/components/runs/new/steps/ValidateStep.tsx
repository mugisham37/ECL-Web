"use client";

import { useCallback, useEffect, useState } from "react";
import { Info, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ValidationSummary } from "../ValidationSummary";
import { ValidationFileItem } from "../ValidationFileItem";
import { useRunWizard } from "../RunWizardContext";
import { useApiSession } from "@/hooks/use-api-session";
import {
  validateRun,
  uploadRunFile,
  deleteUpload,
  downloadTemplate,
  checkBackendAvailable,
} from "@/lib/api/runs";
import { mapValidationResult } from "@/lib/api/mappers";
import { formatApiError } from "@/lib/api/format-api-error";
import type { UploadedFile, ValidationFileResult, FileInputType } from "@/lib/new-run-types";

function collectUploadedFiles(state: {
  pdFiles: UploadedFile[];
  lgdFile: UploadedFile | null;
  eadFile: UploadedFile | null;
}) {
  return [
    ...state.pdFiles,
    ...(state.lgdFile ? [state.lgdFile] : []),
    ...(state.eadFile ? [state.eadFile] : []),
  ];
}

function collectWarningIds(
  fileResults: ValidationFileResult[],
): string[] {
  return fileResults.flatMap((fr) =>
    fr.issues.filter((i) => i.level === "warn").map((i) => i.id),
  );
}

export function ValidateStep() {
  const { state, dispatch } = useRunWizard();
  const { token, tenantId } = useApiSession();
  const [reuploadingId, setReuploadingId] = useState<string | null>(null);

  const runValidation = useCallback(async () => {
    if (!state.runId || !token || !tenantId) return;

    dispatch({ type: "START_VALIDATING" });

    const uploadedFiles = collectUploadedFiles(state);

    const backendUp = await checkBackendAvailable();
    if (!backendUp) {
      dispatch({
        type: "SET_VALIDATION_RESULT",
        result: {
          status: "blocking",
          summary: "We couldn't connect to the service",
          subSummary: "The application is temporarily unavailable.",
          fileResults: [],
          requestError: {
            code: "NETWORK_ERROR",
            hint: "Check your internet connection and try again. If the problem continues, contact your administrator.",
            isServiceUnavailable: true,
          },
        },
      });
      return;
    }

    try {
      const raw = await validateRun(token, tenantId, state.runId, {
        accepted_warning_ids: state.acceptedWarningIds,
      });
      const result = mapValidationResult(raw, uploadedFiles);
      dispatch({ type: "SET_VALIDATION_RESULT", result });
    } catch (err: unknown) {
      const formatted = formatApiError(err);
      dispatch({
        type: "SET_VALIDATION_RESULT",
        result: {
          status: "blocking",
          summary: formatted.summary,
          subSummary: formatted.subSummary,
          fileResults: [],
          requestError: {
            code: formatted.code,
            status: formatted.status,
            hint: formatted.hint,
            isServiceUnavailable: formatted.isServiceUnavailable,
          },
        },
      });
    }
  }, [
    dispatch,
    state.acceptedWarningIds,
    state.eadFile,
    state.lgdFile,
    state.pdFiles,
    state.runId,
    tenantId,
    token,
  ]);

  useEffect(() => {
    if (state.isValidating || state.validationResult || !state.runId || !token || !tenantId) {
      return;
    }
    void runValidation();
  }, [
    runValidation,
    state.isValidating,
    state.validationResult,
    state.runId,
    token,
    tenantId,
  ]);

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
        sheets: result.sheet_count ?? result.sheetCount ?? 0,
        hash: result.sha256 ? result.sha256.slice(0, 4) + "…" + result.sha256.slice(-4) : "—",
        backendUploadId: result.id,
      });
      dispatch({ type: "CLEAR_VALIDATION_RESULT" });
      dispatch({ type: "SET_ACCEPTED_WARNING_IDS", ids: [] });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Re-upload failed";
      dispatch({ type: "UPDATE_FILE_STATUS", id: file.id, status: "error", errorMessage: msg });
    } finally {
      setReuploadingId(null);
    }
  }

  async function handleDownloadTemplate(kind: FileInputType) {
    if (!token || !tenantId) return;
    try {
      await downloadTemplate(token, tenantId, kind);
    } catch {
      /* download errors surface via browser */
    }
  }

  function handleAcceptAllWarnings() {
    if (!state.validationResult) return;
    dispatch({
      type: "SET_ACCEPTED_WARNING_IDS",
      ids: collectWarningIds(state.validationResult.fileResults),
    });
    dispatch({ type: "CLEAR_VALIDATION_RESULT" });
  }

  const uploadedFiles = collectUploadedFiles(state);
  const showRequestRetry = !!state.validationResult?.requestError;
  const warningIds = state.validationResult
    ? collectWarningIds(state.validationResult.fileResults)
    : [];
  const allWarningsAccepted =
    warningIds.length > 0 &&
    warningIds.every((id) => state.acceptedWarningIds.includes(id));

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
                  <div className="rc-sub">Checking columns, types and reference values. Large files may take up to a minute.</div>
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
            <ValidationSummary
              result={state.validationResult}
              onDownloadTemplate={handleDownloadTemplate}
            />

            {state.validationResult.fileResults.map((result) => (
              <ValidationFileItem
                key={result.file.id}
                result={result}
                zoneLabel={result.file.type}
                onReupload={(newFile) => handleReupload(result, newFile)}
                isReuploading={reuploadingId === result.file.id}
                onDownloadTemplate={() => handleDownloadTemplate(result.file.type)}
              />
            ))}

            {showRequestRetry && uploadedFiles.length > 0 && (
              <div className="val-uploaded-list">
                <p className="val-uploaded-title">Files submitted for validation</p>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="val-uploaded-row">
                    <span className="val-uploaded-kind">{file.type}</span>
                    <span className="val-uploaded-name">{file.name}</span>
                  </div>
                ))}
              </div>
            )}

            {state.validationResult.status === "warn" && warningIds.length > 0 && (
              <div className="callout callout-info" style={{ marginTop: "var(--sp-4)" }}>
                <Info size={15} className="ic" aria-hidden="true" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "var(--fs-body)", color: "var(--text)", marginBottom: 8 }}>
                    Warnings won&apos;t block your run, but you must review them before continuing.
                  </div>
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      fontSize: "var(--fs-body)",
                      color: "var(--text)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={allWarningsAccepted}
                      onChange={(e) =>
                        e.target.checked
                          ? handleAcceptAllWarnings()
                          : (dispatch({ type: "SET_ACCEPTED_WARNING_IDS", ids: [] }),
                            dispatch({ type: "CLEAR_VALIDATION_RESULT" }))
                      }
                      style={{ accentColor: "var(--accent)", width: 16, height: 16 }}
                    />
                    I have reviewed the warnings and want to continue
                  </label>
                </div>
              </div>
            )}

            {(showRequestRetry ||
              (state.validationResult.status === "blocking" &&
                state.validationResult.fileResults.length === 0)) && (
              <div style={{ marginTop: "var(--sp-4)", display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: "CLEAR_VALIDATION_RESULT" });
                    void runValidation();
                  }}
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
