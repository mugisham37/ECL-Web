import { AlertTriangle, Upload } from "lucide-react";
import type { FileInputType } from "@/lib/new-run-types";

const KIND_LABEL: Record<FileInputType, string> = {
  PD: "Probability of Default",
  LGD: "Loss Given Default",
  EAD: "Exposure at Default",
};

interface PendingFileItemProps {
  kind: FileInputType;
  onUpload?: () => void;
  recommended?: boolean;
}

export function PendingFileItem({ kind, onUpload, recommended }: PendingFileItemProps) {
  return (
    <div className={`val-file pending${onUpload ? " pending-action" : ""}${recommended ? " pending-next" : ""}`}>
      <div className="vf-head" style={{ cursor: onUpload ? "default" : undefined }}>
        <span
          className="vf-ic"
          style={{ background: "var(--surface-sunken)", color: "var(--text-subtle)" }}
        >
          <AlertTriangle size={13} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="vf-name">{kind}</div>
          <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 2 }}>
            {KIND_LABEL[kind]}
            {recommended ? " — upload this next" : " — not uploaded yet"}
          </div>
        </div>
        <span className="vf-status" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="pill pill-neutral">
            <span className="dot" />
            Not uploaded yet
          </span>
          {onUpload && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onUpload();
              }}
            >
              <Upload size={13} aria-hidden="true" />
              Upload {kind}
            </button>
          )}
        </span>
      </div>
    </div>
  );
}
