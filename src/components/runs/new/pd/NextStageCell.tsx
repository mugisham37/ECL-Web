import { ArrowRight } from "lucide-react";
import { StageBadge } from "@/components/results/shared/StageBadge";
import type { PdStage } from "@/lib/new-run-types";

interface NextStageCellProps {
  stage: PdStage;
  isFinalMonth?: boolean;
}

export function NextStageCell({ stage, isFinalMonth }: NextStageCellProps) {
  return (
    <span className="next-stage">
      <ArrowRight size={14} className="ns-arrow" aria-hidden="true" />
      <StageBadge stage={stage} />
      {isFinalMonth && stage === "offbooks" ? (
        <span className="muted" style={{ fontSize: "var(--fs-micro)", marginLeft: 6 }}>
          end of window
        </span>
      ) : null}
    </span>
  );
}
