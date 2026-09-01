import type { PdCriterion, PdCriterionOutcome } from "@/lib/new-run-types";

const PILL: Record<Exclude<PdCriterionOutcome, "info">, { cls: string; label: string }> = {
  pass: { cls: "pill-success", label: "Pass" },
  review: { cls: "pill-warning", label: "Review" },
  block: { cls: "pill-danger", label: "Block" },
};

interface CriteriaRowProps {
  criterion: PdCriterion;
}

export function CriteriaRow({ criterion }: CriteriaRowProps) {
  if (criterion.outcome === "info") return null;
  const pill = PILL[criterion.outcome];

  return (
    <div className="crit-row">
      <span className={`pill ${pill.cls}`} style={{ marginTop: 1 }}>
        <span className="dot" />
        {pill.label}
      </span>
      <div className="cr-main">
        <div className="cr-name">
          {(criterion.category !== "structural" || criterion.code === "EC-10") && (
            <span className="cr-code">{criterion.code}</span>
          )}
          {criterion.name}
        </div>
        <div className="cr-rationale">{criterion.rationale}</div>
      </div>
    </div>
  );
}
