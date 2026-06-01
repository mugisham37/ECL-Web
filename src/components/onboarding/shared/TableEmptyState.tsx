import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableEmptyStateProps {
  icon: LucideIcon;
  heading: string;
  body: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
}

export function TableEmptyState({
  icon: Icon,
  heading,
  body,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: TableEmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center text-center gap-2 px-6 py-8 rounded-md mt-6"
      style={{
        border: "1px dashed var(--border-strong)",
        background: "var(--surface-sunken)",
      }}
    >
      <div
        className="size-10 rounded-md flex items-center justify-center mb-1"
        style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
      >
        <Icon className="size-5" />
      </div>
      <h3 className="font-semibold" style={{ fontSize: "var(--fs-h3)", color: "var(--text)" }}>
        {heading}
      </h3>
      <p className="max-w-[40ch]" style={{ color: "var(--text-muted)", fontSize: "var(--fs-body)" }}>
        {body}
      </p>
      <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
        <Button size="default" onClick={onPrimary}>
          {primaryLabel}
        </Button>
        <Button variant="secondary" size="default" onClick={onSecondary}>
          {secondaryLabel}
        </Button>
      </div>
    </div>
  );
}
