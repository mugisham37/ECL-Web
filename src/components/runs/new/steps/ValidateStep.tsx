"use client";

import { useCallback, useEffect, useState } from "react";
import { Info, RefreshCw, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ValidationSummary } from "../ValidationSummary";
import { ValidationFileItem } from "../ValidationFileItem";
import { PendingFileItem } from "../pd/PendingFileItem";
import { useRunWizard, fileIsReady, hasLgdAndEad, nextMissingPairFile, pdFilesReady } from "../RunWizardContext";
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
import { validatePdRun } from "@/lib/api/pd-validation";
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

function collectWarningIds(fileResults: ValidationFileResult[]): string[] {
  return fileResults.flatMap((fr) =>
    fr.issues.filter((i) => i.level === "warn").map((i) => i.id),
  );
}

export function ValidateStep() {
  const { state, dispatch } = useRunWizard();
  const { token, tenantId } = useApiSession();
  const [reuploadingId, setReuploadingId] = useState<string | null>(null);

  const pdReady = pdFilesReady(state);
  const paired = hasLgdAndEad(state);

  const runPdValidation = useCallback(async () => {
    if (!state.runId || !token || !tenantId) return;
    dispatch({ type: "START_PD_VALIDATING" });
    const backendUp = await checkBackendAvailable();
    if (!backendUp) {
      dispatch({
        type: "SET_PD_PREVIEW_ERROR",
        error:
          "We couldn't connect to the service — check your internet connection and try again.",
      });
      return;
    }
    try {
      const result = await validatePdRun(token, tenantId, state.runId);
      dispatch({ type: "SET_PD_PREVIEW", result });
    } catch (err: unknown) {
      const formatted = formatApiError(err);
      dispatch({
        type: "SET_PD_PREVIEW_ERROR",
        error: [formatted.summary, formatted.hint].filter(Boolean).join(" — "),
      });
    }
  }, [dispatch, state.runId, tenantId, token]);

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
    if (!pdReady || !state.runId || !token || !tenantId) return;
    if (state.pdPreview) return;
    if (state.pdPreviewStatus === "error") return;
    let cancelled = false;
    (async () => {
      dispatch({ type: "START_PD_VALIDATING" });
      const backendUp = await checkBackendAvailable();
      if (!backendUp) {
        if (!cancelled) {
          dispatch({
            type: "SET_PD_PREVIEW_ERROR",
            error:
              "We couldn't connect to the service — check your internet connection and try again.",
          });
        }
        return;
      }
      try {
        const result = await validatePdRun(token, tenantId, state.runId!);
        if (!cancelled) dispatch({ type: "SET_PD_PREVIEW", result });
      } catch (err: unknown) {
        if (cancelled) return;
        const formatted = formatApiError(err);
        dispatch({
          type: "SET_PD_PREVIEW_ERROR",
          error: [formatted.summary, formatted.hint].filter(Boolean).join(" — "),
        });
      }
    })();
    return () => {
      cancelled = true;
    };
    // pdPreviewStatus is read for the error guard only — not a fetch trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pdReady, state.pdPreview, state.runId, tenantId, token]);

  useEffect(() => {
    if (!paired) return;
    if (state.isValidating || state.validationResult || !state.runId || !token || !tenantId) {
      return;
    }
    void runValidation();
  }, [
    paired,
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
      if (file.type === "PD") {
        dispatch({ type: "CLEAR_PD_PREVIEW" });
      }
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

  const primaryPd = state.pdFiles[0];
  const nextMissing = nextMissingPairFile(state);
  const lgdResult = state.validationResult?.fileResults.find((r) => r.file.type === "LGD");
  const eadResult = state.validationResult?.fileResults.find((r) => r.file.type === "EAD");

  function requestUpload(kind: "LGD" | "EAD") {
    dispatch({ type: "REQUEST_FILE_UPLOAD", kind });
  }
  const pdBlockingResult = state.pdPreview?.status === "blocking" && primaryPd
    ? {
        file: primaryPd,
        issues: state.pdPreview.issues ?? [],
      }
    : null;

  return (
    <div>
      <div className="run-card" style={{ marginBottom: "var(--sp-4)" }}>
        <h2>Validate your files</h2>
        <p className="rc-sub">
          Probability of Default validates on its own, the moment it&apos;s uploaded — Loss Given Default and Exposure at Default validate together once both are uploaded.
        </p>
      </div>

      {!pdReady && (
        <div className="run-card" style={{ marginBottom: "var(--sp-4)" }}>
          <div className="rx-empty" style={{ padding: "var(--sp-12) var(--sp-4)" }}>
            <div className="rx-empty-inner">
              <div className="rx-empty-ic">
                <Upload size={20} />
              </div>
              <h3>No PD file uploaded yet</h3>
              <p>Upload a Probability of Default workbook to validate it — you don&apos;t need Loss Given Default or Exposure at Default yet.</p>
            </div>
          </div>
        </div>
      )}

      {pdReady && state.pdPreviewStatus === "loading" && (
        <div className="run-card" style={{ marginBottom: "var(--sp-4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{ width: 22, height: 22, borderRadius: "50%", border: "2.5px solid var(--accent-border)", borderTopColor: "var(--accent)", animation: "spin 0.7s linear infinite", flexShrink: 0 }}
              aria-hidden="true"
            />
            <div>
              <div style={{ fontWeight: "var(--fw-semibold)" as React.CSSProperties["fontWeight"], color: "var(--text)", fontSize: "var(--fs-body)" }}>
                Validating your PD file…
              </div>
              <div className="rc-sub">Checking structure, staging logic and computing the transition-matrix preview.</div>
            </div>
          </div>
          <div className="progress indeterminate" style={{ marginTop: 16 }}>
            <div className="bar" />
          </div>
        </div>
      )}

      {pdReady && state.pdPreviewStatus === "error" && (
        <div className="val-summary err" style={{ marginBottom: "var(--sp-4)" }}>
          <span className="vs-ic" aria-hidden="true"><RefreshCw size={20} /></span>
          <div className="val-summary-body">
            <div className="vs-t">PD validation could not run</div>
            <div className="vs-d">{state.pdPreviewError ?? "Retry the PD preview."}</div>
            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  dispatch({ type: "CLEAR_PD_PREVIEW" });
                  void runPdValidation();
                }}
              >
                <RefreshCw size={13} aria-hidden="true" />
                Retry PD validation
              </button>
            </div>
          </div>
        </div>
      )}

      {pdReady && state.pdPreviewStatus === "blocked" && pdBlockingResult && (
        <div className="val-summary err" style={{ marginBottom: "var(--sp-4)" }}>
          <span className="vs-ic" aria-hidden="true"><RefreshCw size={20} /></span>
          <div className="val-summary-body">
            <div className="vs-t">
              {pdBlockingResult.issues.length} blocking error{pdBlockingResult.issues.length !== 1 ? "s" : ""} found
            </div>
            <div className="vs-d">
              Fix these in {pdBlockingResult.file.name} and re-upload before this file can continue.
            </div>
          </div>
        </div>
      )}

      {pdReady &&
        (state.pdPreviewStatus === "ready" || state.pdPreviewStatus === "blocked") &&
        state.pdPreview &&
        primaryPd && (
        <ValidationFileItem
          result={{
            file: primaryPd,
            issues: state.pdPreview.issues ?? [],
          }}
          zoneLabel="PD"
          extraFileCount={Math.max(0, state.pdFiles.length - 1)}
          pdPreview={state.pdPreview}
          onReupload={(newFile) =>
            handleReupload(
              { file: primaryPd, issues: state.pdPreview?.issues ?? [] },
              newFile,
            )
          }
          isReuploading={reuploadingId === primaryPd.id}
          onDownloadTemplate={() => handleDownloadTemplate("PD")}
        />
      )}

      <AnimatePresence mode="wait">
        {paired && state.isValidating ? (
          <motion.div
            key="scanning-combined"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="run-card" style={{ marginTop: "var(--sp-4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span
                  style={{ width: 22, height: 22, borderRadius: "50%", border: "2.5px solid var(--accent-border)", borderTopColor: "var(--accent)", animation: "spin 0.7s linear infinite", flexShrink: 0 }}
                  aria-hidden="true"
                />
                <div>
                  <div style={{ fontWeight: "var(--fw-semibold)" as React.CSSProperties["fontWeight"], color: "var(--text)", fontSize: "var(--fs-body)" }}>
                    Validating LGD and EAD…
                  </div>
                  <div className="rc-sub">Checking columns, types and cross-file references.</div>
                </div>
              </div>
              <div className="progress indeterminate" style={{ marginTop: 16 }}>
                <div className="bar" />
              </div>
            </div>
          </motion.div>
        ) : paired && state.validationResult ? (
          <motion.div
            key="combined-results"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {state.validationResult &&
              (state.validationResult.requestError || state.validationResult.status !== "ok") && (
              <ValidationSummary
                result={state.validationResult}
                onDownloadTemplate={handleDownloadTemplate}
              />
            )}

            {lgdResult && (
              <ValidationFileItem
                key={lgdResult.file.id}
                result={lgdResult}
                zoneLabel="LGD"
                onReupload={(newFile) => handleReupload(lgdResult, newFile)}
                isReuploading={reuploadingId === lgdResult.file.id}
                onDownloadTemplate={() => handleDownloadTemplate("LGD")}
              />
            )}
            {eadResult && (
              <ValidationFileItem
                key={eadResult.file.id}
                result={eadResult}
                zoneLabel="EAD"
                onReupload={(newFile) => handleReupload(eadResult, newFile)}
                isReuploading={reuploadingId === eadResult.file.id}
                onDownloadTemplate={() => handleDownloadTemplate("EAD")}
              />
            )}

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
        ) : (
          <>
            {nextMissing && (
              <div className="callout callout-info" style={{ marginTop: "var(--sp-4)", marginBottom: "var(--sp-3)" }}>
                <Upload size={15} className="ic" aria-hidden="true" />
                <span>
                  {nextMissing === "LGD"
                    ? "PD is in. Upload Loss Given Default next — ECL needs LGD and EAD before you can confirm."
                    : "LGD is in. Upload Exposure at Default next, then LGD and EAD will validate together."}
                </span>
              </div>
            )}
            {state.lgdFile ? null : (
              <PendingFileItem
                kind="LGD"
                recommended={nextMissing === "LGD"}
                onUpload={() => requestUpload("LGD")}
              />
            )}
            {state.eadFile ? null : (
              <PendingFileItem
                kind="EAD"
                recommended={nextMissing === "EAD"}
                onUpload={fileIsReady(state.lgdFile) ? () => requestUpload("EAD") : undefined}
              />
            )}
            {state.lgdFile && !lgdResult && paired === false && (
              <div className="val-file" style={{ marginTop: "var(--sp-3)" }}>
                <div className="vf-head" style={{ cursor: "default" }}>
                  <span className="vf-ic" style={{ background: "var(--surface-sunken)", color: "var(--text-muted)" }}>
                    <Info size={13} />
                  </span>
                  <span className="vf-name">{state.lgdFile.name}</span>
                  <span className="vf-status">
                    <span className="pill pill-neutral"><span className="dot" />Uploaded</span>
                  </span>
                </div>
              </div>
            )}
            {state.eadFile && !eadResult && paired === false && (
              <div className="val-file" style={{ marginTop: "var(--sp-3)" }}>
                <div className="vf-head" style={{ cursor: "default" }}>
                  <span className="vf-ic" style={{ background: "var(--surface-sunken)", color: "var(--text-muted)" }}>
                    <Info size={13} />
                  </span>
                  <span className="vf-name">{state.eadFile.name}</span>
                  <span className="vf-status">
                    <span className="pill pill-neutral"><span className="dot" />Uploaded</span>
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </AnimatePresence>

      <div className="callout callout-info" style={{ marginTop: "var(--sp-4)" }}>
        <Info size={15} className="ic" aria-hidden="true" />
        <span>Warnings won&apos;t block your run, but blocking errors must be fixed and re-uploaded before you can continue.</span>
      </div>
    </div>
  );
}
