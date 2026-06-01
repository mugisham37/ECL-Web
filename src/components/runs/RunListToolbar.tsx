"use client";

import { Search, Calendar, User, ChevronDown } from "lucide-react";
import type { RunListFilter, RunDetailStatus } from "@/lib/runs-types";

const STATUS_OPTIONS: { value: RunDetailStatus | "all"; label: string }[] = [
  { value: "all",     label: "All" },
  { value: "success", label: "Complete" },
  { value: "failed",  label: "Failed" },
  { value: "running", label: "Running" },
  { value: "draft",   label: "Draft" },
];

interface RunListToolbarProps {
  filter: RunListFilter;
  onChange: (patch: Partial<RunListFilter>) => void;
}

export function RunListToolbar({ filter, onChange }: RunListToolbarProps) {
  return (
    <div className="list-toolbar">
      {/* Search */}
      <div className="lt-search">
        <Search size={15} className="search-ic" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search Run ID or period…"
          value={filter.search}
          onChange={(e) => onChange({ search: e.target.value })}
          aria-label="Search runs"
        />
      </div>

      {/* Status segmented filter */}
      <div className="status-seg" role="group" aria-label="Filter by status">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            aria-pressed={filter.status === opt.value}
            onClick={() => onChange({ status: opt.value })}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Year filter chip */}
      <button
        className={`filter-chip${filter.year ? " active" : ""}`}
        onClick={() => onChange({ year: filter.year ? null : "2026" })}
        aria-pressed={!!filter.year}
      >
        <Calendar size={13} />
        {filter.year ?? "Year"}
        <ChevronDown size={12} />
      </button>

      {/* User filter chip */}
      <button
        className={`filter-chip${filter.userId ? " active" : ""}`}
        onClick={() => onChange({ userId: filter.userId ? null : "anyone" })}
        aria-pressed={!!filter.userId}
      >
        <User size={13} />
        {filter.userId ? "Filtered" : "Anyone"}
        <ChevronDown size={12} />
      </button>
    </div>
  );
}
