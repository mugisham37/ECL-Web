export type StageBadgeValue = 1 | 2 | 3 | "offbooks";

interface StageBadgeProps {
  stage: StageBadgeValue;
}

export function StageBadge({ stage }: StageBadgeProps) {
  if (stage === "offbooks") {
    return <span className="stage-badge stage-badge-off">Offbooks</span>;
  }

  return (
    <span className={`stage-badge stage-badge-${stage}`}>
      Stage {stage}
    </span>
  );
}
