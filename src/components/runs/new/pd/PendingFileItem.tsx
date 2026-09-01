import { AlertTriangle } from "lucide-react";
import type { FileInputType } from "@/lib/new-run-types";

interface PendingFileItemProps {
  kind: FileInputType;
}

export function PendingFileItem({ kind }: PendingFileItemProps) {
  return (
    <div className="val-file pending">
      <div className="vf-head">
        <span
          className="vf-ic"
          style={{ background: "var(--surface-sunken)", color: "var(--text-subtle)" }}
        >
          <AlertTriangle size={13} />
        </span>
        <span className="vf-name">{kind}</span>
        <span className="vf-status">
          <span className="pill pill-neutral">
            <span className="dot" />
            Not uploaded yet
          </span>
        </span>
      </div>
    </div>
  );
}
