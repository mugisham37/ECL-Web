import type { TenantStatus } from "@/lib/superadmin-types";

interface StatusPillProps {
  status: TenantStatus;
}

const PILL_MAP: Record<TenantStatus, string> = {
  active:    "pill pill-success",
  trial:     "pill pill-warning",
  suspended: "pill pill-danger",
};

const LABEL_MAP: Record<TenantStatus, string> = {
  active:    "Active",
  trial:     "Trial",
  suspended: "Suspended",
};

export function StatusPill({ status }: StatusPillProps) {
  return (
    <span className={PILL_MAP[status]}>
      <span className="dot" />
      {LABEL_MAP[status]}
    </span>
  );
}
