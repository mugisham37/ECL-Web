"use client";

import { ClipboardCheck } from "lucide-react";
import { useRunWizard, pdFilesReady } from "../RunWizardContext";
import { countPdCriteria } from "@/lib/api/pd-validation";
import type { ReactNode } from "react";

export function PdValidateActionRow() {
  const { state, dispatch } = useRunWizard();
  const hasFiles = state.pdFiles.length > 0;
  const scanning = state.pdFiles.some((f) => f.status === "scan");
  const ready = pdFilesReady(state);
  const preview = state.pdPreview;
  const status = state.pdPreviewStatus;

  if (!hasFiles) return null;

  const counts = preview
    ? countPdCriteria(preview.criteria.filter((c) => c.category === "business"))
    : null;
  const showView = status === "ready" && preview;
  const showBlocked = status === "blocked";
  const showLoading = status === "loading";

  function goValidate(revalidate: boolean) {
    if (revalidate) {
      dispatch({ type: "CLEAR_PD_PREVIEW" });
      dispatch({ type: "START_PD_VALIDATING" });
    }
    dispatch({ type: "GO_TO_STEP", step: "validate" });
  }

  let pill: ReactNode = null;
  if (showLoading) {
    pill = (
      <span className="pill pill-running">
        <span className="dot" />
        Validating…
      </span>
    );
  } else if (showBlocked) {
    pill = (
      <span className="pill pill-danger">
        <span className="dot" />
        Blocking errors
      </span>
    );
  } else if (showView && counts) {
    pill = (
      <span className="pill pill-success">
        <span className="dot" />
        Validated · {counts.passed} passed, {counts.review} to review
      </span>
    );
  }

  const canValidate = ready && !scanning && !showLoading;
  const isView = showView || showBlocked;

  return (
    <div className="pd-validate-row">
      {pill ?? (
        <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
          {scanning ? "Upload in progress…" : "PD can be validated without LGD or EAD."}
        </span>
      )}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        disabled={!canValidate && !isView}
        onClick={() => goValidate(!isView)}
      >
        <ClipboardCheck size={14} aria-hidden="true" />
        {isView ? "View validation" : "Validate PD"}
      </button>
    </div>
  );
}
