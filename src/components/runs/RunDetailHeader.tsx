"use client";

import Link from "next/link";
import { ArrowLeft, Download, BarChart3, MoreVertical, RefreshCw, RotateCcw } from "lucide-react";
import { RunStatusPill } from "./shared/RunStatusPill";
import { HashPill } from "./shared/HashPill";
import { RunDetailBanner } from "./RunDetailBanner";
import type { ModalKind } from "./RunActionModal";
import type { RunDetail, RunDetailStatus } from "@/lib/runs-types";

interface RunDetailHeaderProps {
  run: RunDetail;
  onOpenModal: (kind: NonNullable<ModalKind>) => void;
}

function ActionButtons({ status, onOpenModal }: { status: RunDetailStatus; onOpenModal: (k: NonNullable<ModalKind>) => void }) {
  const btnBase: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 6,
    height: "var(--control-h)", padding: "0 14px",
    border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)",
    fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)",
    cursor: "pointer", whiteSpace: "nowrap", transition: "background var(--t-micro)",
  };

  if (status === "running") {
    return (
      <button style={{ ...btnBase, background: "var(--surface)", color: "var(--text)" }}>
        Cancel run
      </button>
    );
  }

  if (status === "failed") {
    return (
      <>
        <button style={{ ...btnBase, background: "var(--surface)", color: "var(--text)" }}>
          <RefreshCw size={14} />
          Edit &amp; retry
        </button>
        <button onClick={() => onOpenModal("more")} style={{ ...btnBase, background: "var(--surface)", color: "var(--text)", padding: "0 10px" }} aria-label="More actions">
          <MoreVertical size={16} />
        </button>
      </>
    );
  }

  if (status === "deleted") {
    return (
      <button onClick={() => onOpenModal("restore")} style={{ ...btnBase, background: "var(--surface)", color: "var(--text)" }}>
        <RotateCcw size={14} />
        Restore run
      </button>
    );
  }

  // complete
  return (
    <>
      <button style={{ ...btnBase, background: "var(--surface)", color: "var(--text)" }}>
        <Download size={14} />
        Download
      </button>
      <button style={{ ...btnBase, background: "var(--accent)", color: "#fff", borderColor: "transparent" }}>
        <BarChart3 size={14} />
        View results
      </button>
      <button onClick={() => onOpenModal("more")} style={{ ...btnBase, background: "var(--surface)", color: "var(--text)", padding: "0 10px" }} aria-label="More actions">
        <MoreVertical size={16} />
      </button>
    </>
  );
}

export function RunDetailHeader({ run, onOpenModal }: RunDetailHeaderProps) {
  const hasBanner = run.status === "running" || run.status === "failed" || run.status === "deleted";

  return (
    <div className="detail-head">
      {/* Back link */}
      <Link href="/runs" className="detail-back">
        <ArrowLeft size={13} />
        All runs
      </Link>

      {/* State banner */}
      {hasBanner && (
        <RunDetailBanner
          variant={run.status as "running" | "failed" | "deleted"}
          run={run}
        />
      )}

      {/* Title row */}
      <div className="detail-top">
        <div>
          <div className="detail-title">
            <h1>{run.name}</h1>
            <HashPill hash={run.id} fullId={run.fullId} />
            <RunStatusPill status={run.status} />
          </div>
          <div className="detail-meta">
            {run.status === "success" && (
              <>
                <span>Computed {run.createdAt}</span>
                <span className="dot" />
                <div className="by-mini">
                  <span className="avatar avatar-sm">{run.byInitials}</span>
                  {run.byName}
                </div>
                {run.elapsed && (
                  <>
                    <span className="dot" />
                    <span>elapsed {run.elapsed}</span>
                  </>
                )}
              </>
            )}
            {run.status === "running" && (
              <>
                <span>Started {run.createdAt}</span>
                <span className="dot" />
                <div className="by-mini">
                  <span className="avatar avatar-sm">{run.byInitials}</span>
                  {run.byName}
                </div>
              </>
            )}
            {run.status === "failed" && (
              <>
                <span>Failed {run.createdAt}</span>
                <span className="dot" />
                <div className="by-mini">
                  <span className="avatar avatar-sm">{run.byInitials}</span>
                  {run.byName}
                </div>
                {run.failureDetails && (
                  <>
                    <span className="dot" />
                    <span>at {run.failureDetails.stage} stage</span>
                  </>
                )}
              </>
            )}
            {run.status === "deleted" && (
              <>
                <span>Computed {run.createdAt}</span>
                <span className="dot" />
                <div className="by-mini">
                  <span className="avatar avatar-sm">{run.byInitials}</span>
                  {run.byName}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="detail-actions">
          <ActionButtons status={run.status} onOpenModal={onOpenModal} />
        </div>
      </div>
    </div>
  );
}
