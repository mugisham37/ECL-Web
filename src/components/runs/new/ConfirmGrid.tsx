import { Lock } from "lucide-react";
import { FileHashPill } from "./shared/FileHashPill";
import { SegmentTag } from "./shared/SegmentTag";
import { DETECTED_SEGMENTS } from "@/lib/new-run-types";
import type { NewRunState } from "@/lib/new-run-types";

interface ConfirmGridProps {
  state: NewRunState;
  onToggleCombine: (v: boolean) => void;
}

export function ConfirmGrid({ state, onToggleCombine }: ConfirmGridProps) {
  const showCombine = state.pdFiles.length > 1;

  return (
    <div>
      <div className="confirm-grid">
        <div className="confirm-row">
          <span className="cr-k">Run name</span>
          <span className="cr-v">{state.runName}</span>
        </div>
        <div className="confirm-row">
          <span className="cr-k">Tenant · currency</span>
          <span className="cr-v">Savanna Bank PLC · KES</span>
        </div>
        <div className="confirm-row">
          <span className="cr-k">PD inputs</span>
          <span className="cr-v">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {state.pdFiles.map((f) => (
                <FileHashPill key={f.id} name={f.name} hash={f.hash} />
              ))}
            </div>
          </span>
        </div>
        {state.lgdFile && (
          <div className="confirm-row">
            <span className="cr-k">LGD input</span>
            <span className="cr-v">
              <FileHashPill name={state.lgdFile.name} hash={state.lgdFile.hash} />
            </span>
          </div>
        )}
        {state.eadFile && (
          <div className="confirm-row">
            <span className="cr-k">EAD input</span>
            <span className="cr-v">
              <FileHashPill name={state.eadFile.name} hash={state.eadFile.hash} />
            </span>
          </div>
        )}
        <div className="confirm-row">
          <span className="cr-k">Segments detected</span>
          <span className="cr-v">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {DETECTED_SEGMENTS.map((s) => <SegmentTag key={s} label={s} />)}
            </div>
          </span>
        </div>
        <div className="confirm-row">
          <span className="cr-k">Engine version</span>
          <span className="cr-v">
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"] }}>
              v1.0.3
            </span>
            {" · "}299 monthly powers
          </span>
        </div>
      </div>

      {/* Combine PD checkbox */}
      {showCombine && (
        <label
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20,
            cursor: "pointer", fontSize: "var(--fs-body)", color: "var(--text)",
          }}
        >
          <input
            type="checkbox"
            checked={state.combinePdFiles}
            onChange={(e) => onToggleCombine(e.target.checked)}
            style={{ accentColor: "var(--accent)", width: 16, height: 16 }}
          />
          Combine the {state.pdFiles.length} PD files into one listing before computing
        </label>
      )}

      {/* Audit callout */}
      <div className="callout callout-success" style={{ marginTop: 16 }}>
        <Lock size={15} className="ic" aria-hidden="true" />
        <span style={{ fontSize: "var(--fs-body)", color: "var(--text)" }}>
          Input hashes are recorded so any auditor can reproduce this exact run later.
        </span>
      </div>
    </div>
  );
}
