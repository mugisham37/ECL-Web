type InputType = "PD" | "LGD" | "EAD";

const COLORS: Record<InputType, { bg: string; color: string }> = {
  PD:  { bg: "var(--accent-subtle)",  color: "var(--accent)" },
  LGD: { bg: "var(--success-subtle)", color: "var(--success)" },
  EAD: { bg: "var(--info-subtle)",    color: "var(--info)" },
};

export function InputBadge({ type }: { type: InputType }) {
  const { bg, color } = COLORS[type];
  return (
    <span
      className="in-badge"
      style={{ background: bg, color }}
      aria-label={`${type} input file`}
    >
      {type}
    </span>
  );
}
