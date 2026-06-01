"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown, Download } from "lucide-react";
import { KpiStrip } from "./KpiStrip";
import { ChartsGrid } from "./ChartsGrid";
import { TrendChart } from "./TrendChart";
import { RunsTable } from "./RunsTable";
import { DashboardBanner } from "./DashboardBanner";
import { EmptyState } from "./EmptyState";
import { LoadingSkeleton } from "./LoadingSkeleton";
import type { DashboardData, DashboardState } from "@/lib/dashboard-types";

// Dev-only state switcher (shows the proto bar from the reference)
const DEV_STATES: { key: DashboardState; label: string }[] = [
  { key: "healthy", label: "Healthy" },
  { key: "empty", label: "First run" },
  { key: "incomplete", label: "Setup" },
  { key: "running", label: "Running" },
  { key: "failed", label: "Failed" },
  { key: "loading", label: "Loading" },
];

function DevSwitcher({
  current,
  onChange,
}: {
  current: DashboardState;
  onChange: (s: DashboardState) => void;
}) {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "var(--surface-raised)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-full)",
        padding: "5px 5px 5px 10px",
        boxShadow: "var(--shadow-pop)",
      }}
    >
      <span
        style={{
          fontSize: "var(--fs-micro)",
          color: "var(--text-subtle)",
          fontFamily: "var(--font-mono)",
          whiteSpace: "nowrap",
        }}
        className="hidden sm:inline"
      >
        Flow 4 · state
      </span>
      <div
        style={{
          display: "inline-flex",
          background: "var(--surface-sunken)",
          borderRadius: 999,
          padding: 2,
        }}
        role="group"
        aria-label="Dashboard state"
      >
        {DEV_STATES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            aria-pressed={current === key}
            style={{
              height: 26,
              padding: "0 9px",
              border: 0,
              background: current === key ? "var(--surface)" : "transparent",
              color: current === key ? "var(--text)" : "var(--text-muted)",
              borderRadius: 999,
              fontSize: "var(--fs-caption)",
              fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"],
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: current === key ? "var(--shadow-hover)" : "none",
              transition: "background var(--t-micro), color var(--t-micro)",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface DashboardViewProps {
  initialData: DashboardData;
  getAllMockData: (state: DashboardState) => DashboardData;
}

export function DashboardView({ initialData, getAllMockData }: DashboardViewProps) {
  const [devState, setDevState] = useState<DashboardState>(initialData.state);
  const data: DashboardData =
    process.env.NODE_ENV === "development" ? getAllMockData(devState) : initialData;

  const { state, kpis, segments, stages, trend, runs, bannerProps, tenant } = data;

  const isIncomplete = state === "incomplete";
  const isFailed = state === "failed";
  const isRunning = state === "running";

  const contextText =
    state === "loading"
      ? "Loading…"
      : state === "empty"
      ? "No runs yet"
      : state === "incomplete"
      ? "Setup incomplete"
      : state === "running"
      ? "Run in progress"
      : state === "failed"
      ? "Last run failed"
      : "Last run 30 May 2026";

  return (
    <>
      {/* Dev state switcher */}
      <DevSwitcher current={devState} onChange={setDevState} />

      {/* Page header */}
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <div className="ph-sub">
            <span>{tenant.name}</span>
            <span style={{ color: "var(--text-subtle)" }}>·</span>
            <span>{contextText}</span>
          </div>
        </div>
        {state !== "empty" && state !== "incomplete" && state !== "loading" && (
          <div className="ph-actions">
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 28,
                padding: "0 10px",
                background: "var(--surface)",
                color: "var(--text)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--r-sm)",
                fontSize: "var(--fs-caption)",
                fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"],
                cursor: "pointer",
              }}
            >
              <Calendar size={12} />
              May 2026
              <ChevronDown size={11} />
            </button>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 28,
                padding: "0 10px",
                background: "var(--surface)",
                color: "var(--text)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--r-sm)",
                fontSize: "var(--fs-caption)",
                fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"],
                cursor: "pointer",
              }}
            >
              <Download size={12} />
              Export
            </button>
          </div>
        )}
      </div>

      {/* State-driven content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* LOADING */}
          {state === "loading" && <LoadingSkeleton />}

          {/* EMPTY (first run hero) */}
          {state === "empty" && <EmptyState />}

          {/* ALL OTHER STATES */}
          {state !== "loading" && state !== "empty" && (
            <>
              {/* Banner slot */}
              <AnimatePresence>
                {bannerProps && (
                  <DashboardBanner key={bannerProps.variant} {...bannerProps} />
                )}
              </AnimatePresence>

              {/* KPI strip */}
              {kpis.length > 0 && (
                <KpiStrip
                  kpis={kpis}
                  locked={isIncomplete}
                  stale={isFailed}
                />
              )}

              {/* Charts (hidden + dimmed in incomplete) */}
              {segments.length > 0 && stages.length > 0 && (
                <ChartsGrid
                  segments={segments}
                  stages={stages}
                  dimmed={isIncomplete}
                />
              )}

              {/* Trend chart */}
              {trend.length > 0 && (
                <TrendChart data={trend} dimmed={isIncomplete} />
              )}

              {/* Recent runs */}
              <RunsTable runs={runs} />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
