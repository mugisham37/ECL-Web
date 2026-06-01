"use client";

import { UploadZone } from "../UploadZone";
import { useRunWizard } from "../RunWizardContext";
import type { UploadedFile } from "@/lib/new-run-types";

export function UploadStep() {
  const { state, dispatch } = useRunWizard();

  return (
    <div>
      {/* Header card */}
      <div className="run-card" style={{ marginBottom: "var(--sp-4)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14, alignItems: "flex-start" }}>
          <div>
            <h2>Upload your monthly files</h2>
            <p className="rc-sub">Three workbooks define a run. Drop each below, or download a blank template.</p>
          </div>
          {/* Run name input */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 200 }}>
            <label
              htmlFor="run-name"
              style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"], color: "var(--text-muted)" }}
            >
              Run name / period
            </label>
            <input
              id="run-name"
              className="input"
              value={state.runName}
              onChange={(e) => dispatch({ type: "SET_RUN_NAME", name: e.target.value })}
              style={{
                height: "var(--control-h)", background: "var(--surface)", border: "1px solid var(--border-strong)",
                borderRadius: "var(--r-sm)", padding: "0 12px", fontSize: "var(--fs-body)", color: "var(--text)",
              }}
              aria-label="Run name or period"
            />
          </div>
        </div>
      </div>

      {/* PD zone */}
      <UploadZone
        type="PD"
        files={state.pdFiles}
        onAdd={(file: UploadedFile) => dispatch({ type: "ADD_PD_FILE", file })}
        onRemove={(id) => dispatch({ type: "REMOVE_PD_FILE", id })}
      />

      {/* LGD zone */}
      <UploadZone
        type="LGD"
        files={state.lgdFile ? [state.lgdFile] : []}
        onAdd={(file: UploadedFile) => dispatch({ type: "SET_LGD_FILE", file })}
        onRemove={() => dispatch({ type: "SET_LGD_FILE", file: null })}
      />

      {/* EAD zone */}
      <UploadZone
        type="EAD"
        files={state.eadFile ? [state.eadFile] : []}
        onAdd={(file: UploadedFile) => dispatch({ type: "SET_EAD_FILE", file })}
        onRemove={() => dispatch({ type: "SET_EAD_FILE", file: null })}
      />
    </div>
  );
}
