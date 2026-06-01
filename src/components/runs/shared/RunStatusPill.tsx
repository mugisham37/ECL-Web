import { Check, X, Loader, Clock, FileText, Trash2 } from "lucide-react";
import type { RunDetailStatus } from "@/lib/runs-types";

const CONFIG: Record<RunDetailStatus, { label: string; className: string; Icon: React.ElementType; spin?: boolean }> = {
  success: { label: "Complete", className: "pill pill-success", Icon: Check },
  failed:  { label: "Failed",   className: "pill pill-danger",  Icon: X },
  running: { label: "Running",  className: "pill pill-running", Icon: Loader, spin: true },
  queued:  { label: "Queued",   className: "pill pill-queued",  Icon: Clock },
  draft:   { label: "Draft",    className: "pill pill-draft",   Icon: FileText },
  deleted: { label: "Deleted",  className: "pill pill-deleted", Icon: Trash2 },
};

export function RunStatusPill({ status }: { status: RunDetailStatus }) {
  const { label, className, Icon, spin } = CONFIG[status];
  return (
    <span className={className}>
      <Icon size={12} style={spin ? { animation: "spin 1s linear infinite" } : undefined} />
      {label}
    </span>
  );
}
