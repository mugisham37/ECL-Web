"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Layers, Filter, Columns, ChevronDown } from "lucide-react";
import type { ExplorerFilter } from "@/lib/results-types";

interface ResultsToolbarProps {
  filter: ExplorerFilter;
  rowSummary: string;
  hidden: boolean;
  onChange: (patch: Partial<ExplorerFilter>) => void;
  onClearFilters: () => void;
}

export function ResultsToolbar({ filter, rowSummary, hidden, onChange }: ResultsToolbarProps) {
  const [stageOpen, setStageOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeCount = filter.stageFilters.filter(Boolean).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (stageRef.current && !stageRef.current.contains(e.target as Node)) {
        setStageOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (hidden) return null;

  function toggleStage(i: number) {
    const next = [...filter.stageFilters] as [boolean, boolean, boolean];
    next[i] = !next[i];
    onChange({ stageFilters: next });
  }

  return (
    <div className="rx-toolbar">
      {/* Search */}
      <div className="rx-search">
        <Search size={15} className="rx-search-ic" aria-hidden />
        <input
          type="search"
          placeholder="Search loan or customer…"
          value={filter.search}
          onChange={(e) => onChange({ search: e.target.value })}
          aria-label="Search loans"
        />
      </div>

      {/* Stage filter */}
      <div className="fdrop" ref={stageRef}>
        <button
          className={`fbtn${activeCount < 3 ? " active" : ""}`}
          onClick={() => setStageOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={stageOpen}
        >
          <Layers size={13} aria-hidden />
          Stage
          {activeCount < 3 && (
            <span
              style={{
                background: "var(--accent)", color: "#fff",
                borderRadius: 999, minWidth: 16, height: 16,
                fontSize: 10, display: "grid", placeItems: "center",
                padding: "0 4px",
              }}
            >
              {activeCount}
            </span>
          )}
          <ChevronDown size={13} aria-hidden />
        </button>
        {stageOpen && (
          <div className="menu-pop stage-pop" role="menu">
            {([1, 2, 3] as const).map((s, i) => (
              <label key={s} className="stage-ck-item" role="menuitemcheckbox" aria-checked={filter.stageFilters[i]}>
                <input
                  type="checkbox"
                  className="stage-ck"
                  checked={filter.stageFilters[i]}
                  onChange={() => toggleStage(i)}
                />
                Stage {s}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Min ECL stub */}
      <button className="fbtn" aria-label="Filter by minimum ECL" disabled style={{ opacity: 0.5 }}>
        <Filter size={13} aria-hidden />
        Min ECL
      </button>

      {/* Columns stub */}
      <button className="fbtn" aria-label="Manage columns" disabled style={{ opacity: 0.5 }}>
        <Columns size={13} aria-hidden />
        Columns
      </button>

      <div className="spacer" />
      <span className="row-summary" aria-live="polite">{rowSummary}</span>
    </div>
  );
}
