import { Info } from "lucide-react";
import { SkeletonBlock } from "@/components/dashboard/shared/SkeletonBlock";
import { EngineVersionCard } from "../atoms/EngineVersionCard";
import type { EngineVersion } from "@/lib/superadmin-types";

interface EngineSectionProps {
  engines: EngineVersion[];
  onPromote: (idx: number) => void;
  isLoading: boolean;
}

export function EngineSection({ engines, onPromote, isLoading }: EngineSectionProps) {
  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SkeletonBlock height={28} width={160} />
        <SkeletonBlock height={56} />
        {[...Array(3)].map((_, i) => <SkeletonBlock key={i} height={120} />)}
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: "var(--fw-semibold)" as string, marginBottom: "var(--sp-4)" }}>
        Engine versions
      </h2>

      {/* info callout */}
      <div className="callout callout-info" style={{ display: "flex", gap: 10, marginBottom: "var(--sp-5)" }}>
        <Info size={16} style={{ flex: "none", marginTop: 1 }} aria-hidden />
        <span>
          Promoting a version sets it as the default for new runs across all unpinned tenants.{" "}
          <strong>Past runs are never altered</strong> — they keep the version they were computed with to preserve determinism.
        </span>
      </div>

      {/* engine list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
        {engines.map((engine, i) => (
          <EngineVersionCard key={engine.version} engine={engine} index={i} onPromote={onPromote} />
        ))}
      </div>
    </div>
  );
}
