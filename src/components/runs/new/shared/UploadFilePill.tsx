"use client";

import { Check, AlertTriangle, AlertCircle, Loader, X } from "lucide-react";
import { motion } from "framer-motion";
import type { UploadedFile } from "@/lib/new-run-types";

const STATUS_ICONS = {
  ok:   { Icon: Check,         cls: "ok" },
  warn: { Icon: AlertTriangle, cls: "warn" },
  error:{ Icon: AlertCircle,   cls: "err" },
  scan: { Icon: Loader,        cls: "scan" },
};

interface UploadFilePillProps {
  file: UploadedFile;
  progress?: number;
  onRemove: (id: string) => void;
}

export function UploadFilePill({ file, progress, onRemove }: UploadFilePillProps) {
  const { Icon, cls } = STATUS_ICONS[file.status];
  const showProgress = file.status === "scan" && progress != null && progress > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
    >
      <div className="fpill">
        <span className={`fp-ic ${cls}`} aria-hidden="true">
          <Icon size={14} style={file.status === "scan" ? { animation: "spin 1s linear infinite" } : undefined} />
        </span>
        <div className="fp-meta">
          <div className="fp-n">{file.name}</div>
          <div className="fp-d">
            {file.status === "error" && file.errorMessage
              ? <span style={{ color: "var(--danger)" }}>{file.errorMessage}</span>
              : showProgress
                ? <>Uploading… {progress}%</>
                : <>{file.size} · {file.sheets} sheet{file.sheets !== 1 ? "s" : ""}</>
            }
            {file.status === "warn" && (
              <span style={{ color: "var(--warning)", marginLeft: 6 }}>· needs review</span>
            )}
          </div>
          {showProgress && (
            <div
              style={{
                marginTop: 6,
                height: 4,
                borderRadius: 2,
                background: "var(--surface-sunken)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "var(--accent)",
                  transition: "width 0.2s ease",
                }}
              />
            </div>
          )}
        </div>
        <button
          onClick={() => onRemove(file.id)}
          aria-label={`Remove ${file.name}`}
          style={{
            width: 28, height: 28, border: 0, background: "none",
            color: "var(--text-subtle)", display: "grid", placeItems: "center",
            borderRadius: "var(--r-sm)", cursor: "pointer", flexShrink: 0,
            transition: "background var(--t-micro), color var(--t-micro)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-sunken)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--danger)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-subtle)"; }}
        >
          <X size={13} />
        </button>
      </div>
    </motion.div>
  );
}
