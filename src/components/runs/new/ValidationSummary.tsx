import { Check, AlertTriangle, X } from "lucide-react";
import type { ValidationResult } from "@/lib/new-run-types";

interface ValidationSummaryProps {
  result: ValidationResult;
  onDownloadTemplate?: (kind: "PD" | "LGD" | "EAD") => void;
}

export function ValidationSummary({ result, onDownloadTemplate }: ValidationSummaryProps) {
  const isOk = result.status === "ok";
  const isWarn = result.status === "warn";
  const isRequestFailure = !!result.requestError;

  const Icon = isOk ? Check : isWarn ? AlertTriangle : X;
  const cls = isOk ? "ok" : isWarn ? "warn" : "err";

  const showStats =
    !isRequestFailure &&
    (result.blockingCount !== undefined || result.warningCount !== undefined);

  const showTemplateActions =
    !isRequestFailure &&
    result.hasTemplateFormatIssues &&
    onDownloadTemplate;

  return (
    <div className={`val-summary ${cls}`}>
      <span className="vs-ic" aria-hidden="true">
        <Icon size={20} />
      </span>
      <div className="val-summary-body">
        <div className="vs-t">{result.summary}</div>
        <div className="vs-d">{result.subSummary}</div>

        {showStats && (
          <div className="val-stats" aria-label="Validation issue counts">
            {(result.blockingCount ?? 0) > 0 && (
              <span className="val-stat val-stat-block">
                {result.blockingCount} blocking
              </span>
            )}
            {(result.warningCount ?? 0) > 0 && (
              <span className="val-stat val-stat-warn">
                {result.warningCount} warning{(result.warningCount ?? 0) !== 1 ? "s" : ""}
              </span>
            )}
            {isOk && (result.detectedSegments?.length ?? 0) > 0 && (
              <span className="val-stat val-stat-ok">
                {result.detectedSegments!.length} segment
                {result.detectedSegments!.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {result.requestError && (
          <div className="val-request-error">
            <p className="val-request-hint">{result.requestError.hint}</p>
          </div>
        )}

        {showTemplateActions && (
          <div className="val-template-actions" style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(["PD", "LGD", "EAD"] as const).map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => onDownloadTemplate!(kind)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 28,
                  padding: "0 10px",
                  background: "none",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "var(--r-sm)",
                  fontSize: "var(--fs-caption)",
                  color: "var(--text)",
                  cursor: "pointer",
                }}
              >
                Download {kind} template
              </button>
            ))}
          </div>
        )}

        {!isRequestFailure &&
          (result.detectedSegments?.length ?? 0) > 0 &&
          !isOk && (
            <p className="val-segments">
              Detected segments: {result.detectedSegments!.join(", ")}
            </p>
          )}
      </div>
    </div>
  );
}
