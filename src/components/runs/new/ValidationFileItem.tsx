"use client";

import { useState } from "react";
import { File, ChevronDown, AlertTriangle, AlertCircle, RefreshCw } from "lucide-react";
import type { ValidationFileResult } from "@/lib/new-run-types";

interface ValidationFileItemProps {
  result: ValidationFileResult;
  zoneLabel: string;
  onReupload: (newFile: File) => void;
  isReuploading?: boolean;
}

export function ValidationFileItem({ result, zoneLabel, onReupload, isReuploading }: ValidationFileItemProps) {
  const [open, setOpen] = useState(result.issues.length > 0);
  const { file, issues } = result;
  const hasIssues = issues.length > 0;

  const statusPill = !hasIssues ? (
    <span className="pill pill-success" style={{ height: 18 }}>Valid</span>
  ) : (
    <span className="pill pill-warning" style={{ height: 18 }}>
      <AlertTriangle size={11} />
      {issues.length} warning{issues.length !== 1 ? "s" : ""}
    </span>
  );

  const iconBg = !hasIssues ? "var(--success-subtle)" : "var(--warning-subtle)";
  const iconColor = !hasIssues ? "var(--success)" : "var(--warning)";

  return (
    <div className={`val-file${open ? " open" : ""}`}>
      <div
        className="vf-head"
        onClick={() => hasIssues && setOpen((v) => !v)}
        role={hasIssues ? "button" : undefined}
        tabIndex={hasIssues ? 0 : undefined}
        onKeyDown={(e) => e.key === "Enter" && hasIssues && setOpen((v) => !v)}
      >
        <span className="vf-ic" style={{ background: iconBg, color: iconColor }}>
          <File size={13} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="vf-name">{file.name}</div>
          <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex", alignItems: "center", height: 18, padding: "0 7px",
                background: "var(--surface-sunken)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)",
                fontSize: "var(--fs-micro)", fontFamily: "var(--font-mono)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase",
              }}
            >
              {zoneLabel}
            </span>
            {file.size} · {file.sheets} sheet{file.sheets !== 1 ? "s" : ""}
          </div>
        </div>
        <div className="vf-status">
          {statusPill}
          {hasIssues && <ChevronDown size={15} className="vf-chev" />}
        </div>
      </div>

      {/* Expandable issue list */}
      {open && hasIssues && (
        <div className="vf-body">
          {issues.map((issue, i) => (
            <div key={i} className={`issue ${issue.level}`}>
              {issue.level === "warn" ? (
                <AlertTriangle size={14} className="iss-ic" />
              ) : (
                <AlertCircle size={14} className="iss-ic" />
              )}
              <div>
                <div style={{ fontSize: "var(--fs-body)", color: "var(--text)" }}>{issue.title}</div>
                <div className="iss-loc">{issue.location}</div>
                <div className="iss-fix">{issue.fix}</div>
              </div>
            </div>
          ))}
          <button
            style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12,
              height: 28, padding: "0 10px", background: "var(--surface)", color: "var(--text)",
              border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)",
              fontSize: "var(--fs-caption)", cursor: isReuploading ? "not-allowed" : "pointer",
              opacity: isReuploading ? 0.6 : 1,
            }}
            disabled={isReuploading}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".xlsx,.xls";
              input.onchange = (e) => {
                const picked = (e.target as HTMLInputElement).files?.[0];
                if (picked) onReupload(picked);
              };
              input.click();
            }}
          >
            <RefreshCw size={12} style={{ animation: isReuploading ? "spin 0.7s linear infinite" : "none" }} />
            {isReuploading ? "Uploading…" : `Re-upload ${file.name}`}
          </button>
        </div>
      )}
    </div>
  );
}
