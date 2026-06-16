"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronDown, Download, Minimize2, Maximize2 } from "lucide-react";
import type { RunContext } from "@/lib/results-types";
import type { RunListItem } from "@/lib/runs-types";
import { RunSwitcher } from "./RunSwitcher";

interface ResultsHeaderProps {
  runContext: RunContext;
  runs: RunListItem[];
  currentRunFullId: string;
  runsLoading?: boolean;
  density: "compact" | "comfortable";
  onDensityToggle: () => void;
  onRunSelect: (fullId: string) => void;
}

export function ResultsHeader({
  runContext,
  runs,
  currentRunFullId,
  runsLoading,
  density,
  onDensityToggle,
  onRunSelect,
}: ResultsHeaderProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="rx-head">
      <div>
        <div className="rx-context">
          <h1>Results</h1>
          <RunSwitcher
            runs={runs}
            currentRunFullId={currentRunFullId}
            currentPeriod={runContext.period}
            currentRunId={runContext.runId}
            isLoading={runsLoading}
            onSelect={onRunSelect}
          />
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: "var(--fs-caption)",
            color: "var(--text-muted)",
          }}
        >
          Computed {runContext.computedAt} · engine {runContext.engineVersion} · all amounts in{" "}
          <strong>{runContext.currency}</strong>
        </div>
      </div>

      <div className="rx-head-actions">
        {/* Density toggle */}
        <button className="fbtn" onClick={onDensityToggle} aria-label="Toggle density">
          {density === "compact" ? (
            <>
              <Maximize2 size={13} aria-hidden />
              Comfortable
            </>
          ) : (
            <>
              <Minimize2 size={13} aria-hidden />
              Compact
            </>
          )}
        </button>

        {/* Export menu */}
        <div className="fdrop" ref={exportRef}>
          <button
            className="fbtn"
            onClick={() => setExportOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={exportOpen}
          >
            <Download size={13} aria-hidden />
            Export
            <ChevronDown size={13} aria-hidden />
          </button>
          {exportOpen && (
            <div className="menu-pop" role="menu" style={{ minWidth: 240 }}>
              <button className="mp-item" role="menuitem">
                <Download size={14} className="mp-ic" aria-hidden />
                Current view (.csv)
              </button>
              <button className="mp-item" role="menuitem">
                <Download size={14} className="mp-ic" aria-hidden />
                Full results workbook (.xlsx)
              </button>
              <button className="mp-item" role="menuitem">
                <Download size={14} className="mp-ic" aria-hidden />
                PD / LGD / EAD workbooks (.zip)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
