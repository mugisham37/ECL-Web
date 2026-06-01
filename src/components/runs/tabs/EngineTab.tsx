import { Check } from "lucide-react";
import { EngineInfoRow } from "../EngineInfoRow";
import { ReproduceCallout } from "../ReproduceCallout";
import type { RunDetail } from "@/lib/runs-types";

interface EngineTabProps {
  run: RunDetail;
  onRerun?: () => void;
}

export function EngineTab({ run, onRerun }: EngineTabProps) {
  const info = run.engineInfo;

  return (
    <div>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-md)",
          padding: "0 16px",
        }}
      >
        <EngineInfoRow label="Engine version">
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: "var(--fw-medium)" }}>{info.version}</span>
          {" · released "}
          {info.releasedDate}
        </EngineInfoRow>
        <EngineInfoRow label="PD method">{info.pdMethod}</EngineInfoRow>
        <EngineInfoRow label="LGD method">{info.lgdMethod}</EngineInfoRow>
        <EngineInfoRow label="EAD method">{info.eadMethod}</EngineInfoRow>
        <EngineInfoRow label="PD files combined">
          {info.pdFilesCombined ? "Yes · files merged into one listing" : "No · single file"}
        </EngineInfoRow>
        <EngineInfoRow label="Determinism">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Check size={14} style={{ color: "var(--success)" }} />
            No randomness · no wall-clock dependence
          </span>
        </EngineInfoRow>
      </div>

      <ReproduceCallout onRerun={onRerun} />
    </div>
  );
}
