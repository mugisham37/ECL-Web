import { ArrowRight } from "lucide-react";
import { StageBadge } from "@/components/results/shared/StageBadge";
import type { PdStage } from "@/lib/new-run-types";

interface NextStageCellProps {
  stage: PdStage;
}

export function NextStageCell({ stage }: NextStageCellProps) {
  return (
    <span className="next-stage">
      <ArrowRight size={14} className="ns-arrow" aria-hidden="true" />
      <StageBadge stage={stage} />
    </span>
  );
}
