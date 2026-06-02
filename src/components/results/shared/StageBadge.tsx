interface StageBadgeProps {
  stage: 1 | 2 | 3;
}

export function StageBadge({ stage }: StageBadgeProps) {
  return (
    <span className={`stage-badge stage-badge-${stage}`}>
      Stage {stage}
    </span>
  );
}
