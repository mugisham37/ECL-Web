import { Check, X, Loader, Clock } from "lucide-react";
import type { RunStatus } from "@/lib/dashboard-types";

const CONFIG: Record<
  RunStatus,
  { label: string; className: string; Icon: React.ElementType }
> = {
  success: { label: "Complete", className: "pill pill-success", Icon: Check },
  failed: { label: "Failed", className: "pill pill-danger", Icon: X },
  running: { label: "Running", className: "pill pill-running", Icon: Loader },
  queued: { label: "Queued", className: "pill pill-queued", Icon: Clock },
};

export function StatusPill({ status }: { status: RunStatus }) {
  const { label, className, Icon } = CONFIG[status];
  return (
    <span className={className}>
      <Icon
        size={12}
        style={status === "running" ? { animation: "spin 1s linear infinite" } : undefined}
      />
      {label}
    </span>
  );
}
