"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { RunListToolbar } from "./RunListToolbar";
import { RunsListTable } from "./RunsListTable";
import { defaultRunListFilter } from "@/lib/runs-types";
import type { RunListItem, RunListFilter } from "@/lib/runs-types";

interface RunsListViewProps {
  runs: RunListItem[];
  tenantName: string;
}

export function RunsListView({ runs, tenantName }: RunsListViewProps) {
  const [filter, setFilter] = useState<RunListFilter>(defaultRunListFilter);

  function handleFilterChange(patch: Partial<RunListFilter>) {
    setFilter((prev) => ({ ...prev, ...patch }));
  }

  function clearFilters() {
    setFilter(defaultRunListFilter);
  }

  const filtered = useMemo(() => {
    return runs.filter((run) => {
      const matchStatus = filter.status === "all" || run.status === filter.status;
      const q = filter.search.toLowerCase();
      const matchSearch = !q || run.id.toLowerCase().includes(q) || run.period.toLowerCase().includes(q) || run.name.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [runs, filter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Page header */}
      <div className="page-head">
        <div>
          <h1>Runs</h1>
          <div className="ph-sub">
            <span>{runs.length} run{runs.length !== 1 ? "s" : ""}</span>
            <span style={{ color: "var(--text-subtle)" }}>·</span>
            <span>{tenantName}</span>
          </div>
        </div>
        <div className="ph-actions">
          <Link
            href="/runs/new"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              height: "var(--control-h)", padding: "0 14px",
              background: "var(--accent)", color: "#fff",
              borderRadius: "var(--r-sm)", textDecoration: "none",
              fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"],
              cursor: "pointer", transition: "background var(--t-micro)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-hover)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)")}
          >
            <Plus size={16} />
            New Run
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <RunListToolbar filter={filter} onChange={handleFilterChange} />

      {/* Table */}
      <RunsListTable
        runs={filtered}
        totalCount={runs.length}
        onClearFilters={clearFilters}
      />
    </motion.div>
  );
}
