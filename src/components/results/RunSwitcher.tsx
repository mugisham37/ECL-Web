"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import type { RunListItem } from "@/lib/runs-types";
import { RunStatusPill } from "@/components/runs/shared/RunStatusPill";

type RunFilter = "all" | "success" | "running" | "failed" | "draft";

interface RunSwitcherProps {
  runs: RunListItem[];
  currentRunFullId: string;
  currentPeriod: string;
  currentRunId: string;
  isLoading?: boolean;
  onSelect: (run: RunListItem) => void;
}

const FILTER_OPTIONS: { value: RunFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "success", label: "Complete" },
  { value: "running", label: "Running" },
  { value: "failed", label: "Failed" },
  { value: "draft", label: "Draft" },
];

function matchesFilter(run: RunListItem, filter: RunFilter): boolean {
  if (filter === "all") return true;
  if (filter === "running") return run.status === "running" || run.status === "queued";
  return run.status === filter;
}

function isResultsRun(status: RunListItem["status"]): boolean {
  return status === "success";
}

function actionLabel(status: RunListItem["status"]): string {
  if (status === "success") return "View results";
  if (status === "deleted") return "Unavailable";
  return "Open run";
}

function formatEcl(run: RunListItem): string | null {
  if (run.eclAmount == null) return null;
  const { eclAmount, currency } = run;
  if (eclAmount >= 1_000_000) return `${currency} ${(eclAmount / 1_000_000).toFixed(1)}M`;
  return `${currency} ${eclAmount.toLocaleString()}`;
}

export function RunSwitcher({
  runs,
  currentRunFullId,
  currentPeriod,
  currentRunId,
  isLoading,
  onSelect,
}: RunSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<RunFilter>("all");
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) {
      setSearch("");
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open]);

  const filteredRuns = useMemo(() => {
    const q = search.trim().toLowerCase();
    return runs.filter((run) => {
      if (!matchesFilter(run, filter)) return false;
      if (!q) return true;
      return (
        run.name.toLowerCase().includes(q) ||
        run.period.toLowerCase().includes(q) ||
        run.fullId.toLowerCase().includes(q) ||
        run.id.toLowerCase().includes(q)
      );
    });
  }, [runs, search, filter]);

  function handleSelect(run: RunListItem) {
    if (run.status === "deleted") return;
    onSelect(run);
    setOpen(false);
  }

  const labelPeriod = currentPeriod !== "—" ? currentPeriod : "Select run";
  const labelId = currentRunId !== "—" ? currentRunId : "—";

  return (
    <div className="fdrop run-switch-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`run-switch${open ? " open" : ""}`}
        aria-label="Switch run"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>Run</span>
        <span className="mono">
          {labelPeriod} · {labelId}
        </span>
        <ChevronDown size={13} aria-hidden />
      </button>

      {open && (
        <div className="menu-pop run-switch-pop" role="menu">
          <div className="mp-head">
            <div className="run-switch-pop-title">Switch run</div>
            <div className="run-switch-search">
              <Search size={14} aria-hidden />
              <input
                ref={searchRef}
                type="search"
                placeholder="Search runs…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search runs"
              />
            </div>
            <div className="run-switch-filters" role="tablist" aria-label="Filter runs">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="tab"
                  aria-selected={filter === opt.value}
                  className={`run-switch-filter${filter === opt.value ? " active" : ""}`}
                  onClick={() => setFilter(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="run-switch-list" role="presentation">
            {isLoading && (
              <div className="run-switch-empty">Loading runs…</div>
            )}
            {!isLoading && filteredRuns.length === 0 && (
              <div className="run-switch-empty">No runs match your search.</div>
            )}
            {!isLoading &&
              filteredRuns.map((run) => {
                const isActive = isResultsRun(run.status) && run.fullId === currentRunFullId;
                const isDeleted = run.status === "deleted";
                const ecl = formatEcl(run);

                return (
                  <button
                    key={run.fullId}
                    type="button"
                    role="menuitem"
                    className={`mp-item run-switch-item${isActive ? " active" : ""}${isDeleted ? " disabled" : ""}${!isResultsRun(run.status) && !isDeleted ? " run-switch-item-nav" : ""}`}
                    disabled={isDeleted}
                    aria-current={isActive ? "true" : undefined}
                    title={actionLabel(run.status)}
                    onClick={() => handleSelect(run)}
                  >
                    <div className="run-switch-item-main">
                      <div className="run-switch-item-title">
                        <span>{run.name || run.period}</span>
                        {isActive && <Check size={14} aria-hidden />}
                      </div>
                      <div className="run-switch-item-meta">
                        <span className="mono">{run.id}</span>
                        <span>{run.createdAt}</span>
                        {ecl && <span>{ecl}</span>}
                        {!isResultsRun(run.status) && !isDeleted && (
                          <span className="run-switch-item-action">{actionLabel(run.status)}</span>
                        )}
                      </div>
                    </div>
                    <RunStatusPill status={run.status} />
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
