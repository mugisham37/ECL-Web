import { AlertTriangle, Download } from "lucide-react";
import { InputFileCard } from "../InputFileCard";
import type { RunDetail } from "@/lib/runs-types";

interface InputsTabProps {
  run: RunDetail;
}

export function InputsTab({ run }: InputsTabProps) {
  const hasWarnings = (run.acceptedWarnings ?? 0) > 0;

  return (
    <div>
      {/* Warning callout */}
      {hasWarnings && (
        <div className="callout callout-warning" style={{ marginBottom: "var(--sp-4)" }}>
          <AlertTriangle size={16} className="ic" style={{ flexShrink: 0, marginTop: 1, color: "var(--warning)" }} />
          <span style={{ fontSize: "var(--fs-body)", color: "var(--text)" }}>
            This run was computed with{" "}
            <strong>{run.acceptedWarnings} accepted warning{run.acceptedWarnings !== 1 ? "s" : ""}</strong>. They did not block the calculation.
          </span>
        </div>
      )}

      {/* Input file cards */}
      {run.inputFiles.map((file) => (
        <InputFileCard key={`${file.type}-${file.name}`} file={file} />
      ))}

      {/* Download all */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <button
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            height: "var(--control-h)", padding: "0 14px",
            background: "var(--surface)", color: "var(--text)",
            border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)",
            fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"],
            cursor: "pointer", transition: "background var(--t-micro)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--surface-sunken)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--surface)")}
        >
          <Download size={14} />
          Download all inputs (.zip)
        </button>
      </div>
    </div>
  );
}
