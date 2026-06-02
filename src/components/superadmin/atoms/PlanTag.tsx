import type { TenantPlan } from "@/lib/superadmin-types";

interface PlanTagProps {
  plan: TenantPlan;
}

export function PlanTag({ plan }: PlanTagProps) {
  return (
    <span className={`plan-tag plan-${plan.toLowerCase()}`}>{plan}</span>
  );
}
