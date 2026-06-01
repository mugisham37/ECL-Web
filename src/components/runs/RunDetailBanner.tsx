"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import type { RunDetail } from "@/lib/runs-types";

type BannerVariant = "running" | "failed" | "deleted";

interface RunDetailBannerProps {
  variant: BannerVariant;
  run: RunDetail;
}

export function RunDetailBanner({ variant, run }: RunDetailBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.2 }}
      style={{ overflow: "hidden" }}
    >
      {variant === "running" && (
        <div className="detail-banner running">
          <span
            style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--accent-border)", borderTopColor: "var(--accent)", animation: "spin 0.7s linear infinite", flexShrink: 0 }}
            aria-hidden="true"
          />
          <span className="grow" style={{ fontSize: "var(--fs-body)" }}>
            <strong>Computing…</strong>{" "}
            <span style={{ color: "var(--text-muted)" }}>LGD engine · 1,247 loans</span>
          </span>
          <div style={{ width: 200 }}>
            <div className="progress-track">
              <motion.div className="progress-bar" initial={{ scaleX: 0 }} animate={{ scaleX: 0.45 }} transition={{ duration: 0.6, ease: "easeOut" }} />
            </div>
          </div>
        </div>
      )}

      {variant === "failed" && run.failureDetails && (
        <div className="detail-banner failed">
          <AlertTriangle size={18} className="db-ic" style={{ flexShrink: 0 }} />
          <span className="grow" style={{ fontSize: "var(--fs-body)" }}>
            <strong>Failed at the {run.failureDetails.stage} stage:</strong>{" "}
            {run.failureDetails.message}{" "}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-subtle)" }}>
              ref {run.failureDetails.ref}
            </span>
          </span>
        </div>
      )}

      {variant === "deleted" && (
        <div className="detail-banner deleted">
          <Trash2 size={18} className="db-ic" style={{ flexShrink: 0 }} />
          <span className="grow" style={{ fontSize: "var(--fs-body)" }}>
            This run was soft-deleted by <strong>{run.deletedBy}</strong> on {run.deletedAt}. It&apos;s retained for audit and can be restored.
          </span>
        </div>
      )}
    </motion.div>
  );
}
