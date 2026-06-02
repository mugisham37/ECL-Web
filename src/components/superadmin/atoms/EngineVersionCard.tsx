import { Check, ArrowUp } from "lucide-react";
import type { EngineVersion } from "@/lib/superadmin-types";

interface EngineVersionCardProps {
  engine: EngineVersion;
  index: number;
  onPromote: (idx: number) => void;
}

export function EngineVersionCard({ engine, index, onPromote }: EngineVersionCardProps) {
  return (
    <div
      style={{
        border: `1px solid ${engine.isCurrent ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "var(--r-md)",
        overflow: "hidden",
        background: "var(--surface)",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 16 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "1.1rem",
            fontWeight: "var(--fw-medium)" as string,
            color: "var(--text)",
          }}
        >
          {engine.version}
        </span>

        {engine.isCurrent && (
          <span className="pill pill-success" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Check size={12} aria-hidden />
            Default
          </span>
        )}

        <div style={{ flex: 1, fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
          Released {engine.releaseDate} · {engine.tenantsPinned} tenant{engine.tenantsPinned !== 1 ? "s" : ""} pinned
        </div>

        {!engine.isCurrent && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onPromote(index)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <ArrowUp size={13} aria-hidden />
            Promote to default
          </button>
        )}
      </div>

      {/* Changelog */}
      <div style={{ padding: "0 16px 16px" }}>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
          {engine.changelog.map((entry, i) => (
            <li key={i} style={{ display: "flex", gap: 9, fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
              <Check size={14} style={{ color: "var(--accent)", flex: "none", marginTop: 1 }} aria-hidden />
              {entry}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
