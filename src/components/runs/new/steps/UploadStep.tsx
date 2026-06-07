"use client";

import { UploadZone } from "../UploadZone";
import { useRunWizard } from "../RunWizardContext";
import { useFileUpload } from "@/hooks/use-file-upload";
import type { UploadedFile, FileInputType } from "@/lib/new-run-types";

function formatBytes(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(0)} KB`;
  return `${bytes} B`;
}

export function UploadStep() {
  const { state, dispatch } = useRunWizard();
  const { uploadFile } = useFileUpload();

  async function handleAdd(kind: FileInputType, file: File) {
    const clientId = `${kind}-${Date.now()}`;
    const pending: UploadedFile = {
      id: clientId,
      name: file.name,
      size: formatBytes(file.size),
      sheets: 0,
      type: kind,
      status: "scan",
      hash: "—",
    };

    if (kind === "PD") {
      dispatch({ type: "ADD_PD_FILE", file: pending });
    } else if (kind === "LGD") {
      dispatch({ type: "SET_LGD_FILE", file: pending });
    } else {
      dispatch({ type: "SET_EAD_FILE", file: pending });
    }

    if (!state.runId) {
      dispatch({ type: "UPDATE_FILE_STATUS", id: clientId, status: "error" });
      return;
    }

    try {
      const result = await uploadFile(
        state.runId,
        kind,
        file,
        (pct) => dispatch({ type: "SET_UPLOAD_PROGRESS", fileId: clientId, progress: pct }),
      );
      dispatch({ type: "SET_UPLOADED_FILE_ID", fileId: clientId, serverId: result.id });
      dispatch({
        type: "UPDATE_FILE_STATUS",
        id: clientId,
        status: "ok",
        hash: result.sha256 ? result.sha256.slice(0, 4) + "…" + result.sha256.slice(-4) : "—",
        sheets: result.sheet_count ?? 0,
      });
    } catch {
      dispatch({ type: "UPDATE_FILE_STATUS", id: clientId, status: "error" });
    }
  }

  function handleDownloadTemplate(kind: FileInputType) {
    const a = document.createElement("a");
    a.href = `/templates/ECL_${kind}_template.xlsx`;
    a.download = `ECL_${kind}_template.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

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
        onAdd={(file) => handleAdd("PD", file)}
        onRemove={(id) => dispatch({ type: "REMOVE_PD_FILE", id })}
        onDownloadTemplate={() => handleDownloadTemplate("PD")}
      />

      {/* LGD zone */}
      <UploadZone
        type="LGD"
        files={state.lgdFile ? [state.lgdFile] : []}
        onAdd={(file) => handleAdd("LGD", file)}
        onRemove={() => dispatch({ type: "SET_LGD_FILE", file: null })}
        onDownloadTemplate={() => handleDownloadTemplate("LGD")}
      />

      {/* EAD zone */}
      <UploadZone
        type="EAD"
        files={state.eadFile ? [state.eadFile] : []}
        onAdd={(file) => handleAdd("EAD", file)}
        onRemove={() => dispatch({ type: "SET_EAD_FILE", file: null })}
        onDownloadTemplate={() => handleDownloadTemplate("EAD")}
      />
    </div>
  );
}
