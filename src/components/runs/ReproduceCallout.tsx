import { RefreshCw } from "lucide-react";

interface ReproduceCalloutProps {
  onRerun?: () => void;
}

export function ReproduceCallout({ onRerun }: ReproduceCalloutProps) {
  return (
    <div className="reproduce">
      <span className="rp-ic" aria-hidden="true">
        <RefreshCw size={20} />
      </span>
      <div className="grow">
        <p style={{ fontWeight: "var(--fw-semibold)" as React.CSSProperties["fontWeight"], color: "var(--text)", fontSize: "var(--fs-body)" }}>
          Reproduce this run
        </p>
        <p style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 2 }}>
          Re-run the same input hashes on the same engine version to verify byte-identical output.
        </p>
      </div>
      <button
        onClick={onRerun}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          height: "var(--control-h)", padding: "0 14px",
          background: "var(--accent)", color: "#fff",
          border: "none", borderRadius: "var(--r-sm)",
          fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"],
          cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
          transition: "background var(--t-micro)",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--accent-hover)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--accent)")}
      >
        <RefreshCw size={14} />
        Re-run
      </button>
    </div>
  );
}
