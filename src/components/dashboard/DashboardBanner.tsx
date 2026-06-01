"use client";

import { Info, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import type { BannerProps } from "@/lib/dashboard-types";

export function DashboardBanner({ variant, progress, failedAt, errorRef, setupStep }: BannerProps) {
  if (variant === "incomplete") {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.22 }}
        style={{ overflow: "hidden" }}
      >
        <div className="dash-banner incomplete">
          <Info size={18} className="banner-ic" style={{ flexShrink: 0 }} />
          <span className="grow">
            <strong>Finish setting up your workspace.</strong> Your team can&apos;t
            run ECLs until {setupStep ?? "setup"} {setupStep ? "are" : "is"} configured.
          </span>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              height: 28,
              padding: "0 10px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--r-sm)",
              fontSize: "var(--fs-caption)",
              fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"],
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Resume setup
            <ArrowRight size={12} />
          </button>
        </div>
      </motion.div>
    );
  }

  if (variant === "running") {
    const pct = progress ?? 0;
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.22 }}
        style={{ overflow: "hidden" }}
      >
        <div className="dash-banner running">
          {/* Spinner */}
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: "2px solid var(--accent-border)",
              borderTopColor: "var(--accent)",
              animation: "spin 0.7s linear infinite",
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
          <div className="run-progress">
            <div className="rp-top">
              <span style={{ fontSize: "var(--fs-body)" }}>
                <strong>Computing ECL…</strong>{" "}
                <span style={{ color: "var(--text-muted)" }}>LGD engine</span>
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--fs-caption)",
                  color: "var(--text-muted)",
                }}
              >
                {pct}%
              </span>
            </div>
            <div className="progress-track">
              <motion.div
                className="progress-bar"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: pct / 100 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 28,
              padding: "0 10px",
              background: "var(--surface)",
              color: "var(--text)",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--r-sm)",
              fontSize: "var(--fs-caption)",
              fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"],
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            View run
          </button>
        </div>
      </motion.div>
    );
  }

  if (variant === "failed") {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.22 }}
        style={{ overflow: "hidden" }}
      >
        <div className="dash-banner failed">
          <AlertTriangle size={18} className="banner-ic" style={{ flexShrink: 0 }} />
          <span className="grow">
            <strong>Your last run on {failedAt ?? "recent date"} failed.</strong>{" "}
            Figures below reflect the last successful run.
            {errorRef && (
              <span
                style={{
                  marginLeft: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--fs-caption)",
                }}
              >
                ref {errorRef}
              </span>
            )}
          </span>
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
              whiteSpace: "nowrap",
            }}
          >
            <RefreshCw size={12} />
            Retry run
          </button>
        </div>
      </motion.div>
    );
  }

  return null;
}
