import { Download } from "lucide-react";
import { SkeletonBlock } from "@/components/dashboard/shared/SkeletonBlock";
import { AuditEvent } from "../atoms/AuditEvent";
import type { AuditEntry } from "@/lib/superadmin-types";
import type { ToastItem } from "@/lib/admin-types";

interface AuditSectionProps {
  auditEntries: AuditEntry[];
  isLoading: boolean;
  onToast: (msg: string, kind?: ToastItem["kind"]) => void;
  onExportCsv?: () => void;
}

export function AuditSection({ auditEntries, isLoading, onToast, onExportCsv }: AuditSectionProps) {
  if (isLoading) {
    return (
      <div>
        <div style={{ marginBottom: 16 }}><SkeletonBlock height={28} width={120} /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[...Array(6)].map((_, i) => (
            <SkeletonBlock key={i} height={68} className="skel-row" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--sp-5)" }}>
        <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: "var(--fw-semibold)" as string }}>
          Platform audit log
        </h2>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => (onExportCsv ? onExportCsv() : onToast("CSV export unavailable.", "info"))}
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <Download size={13} aria-hidden />
          Export CSV
        </button>
      </div>

      {/* timeline */}
      <div className="card" style={{ padding: "4px 20px" }}>
        {auditEntries.map((entry, i) => (
          <AuditEvent key={i} entry={entry} showActor />
        ))}
      </div>
    </div>
  );
}
