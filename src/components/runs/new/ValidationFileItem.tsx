"use client";

import { useState } from "react";
import { File, ChevronDown, AlertTriangle, AlertCircle, RefreshCw } from "lucide-react";
import type { ValidationFileResult } from "@/lib/new-run-types";

interface ValidationFileItemProps {
  result: ValidationFileResult;
  zoneLabel: string;
  onReupload: (newFile: File) => void;
  isReuploading?: boolean;
  onDownloadTemplate?: () => void;
}

export function ValidationFileItem({
  result,
  zoneLabel,
  onReupload,
  isReuploading,
  onDownloadTemplate,
}: ValidationFileItemProps) {
  const { file, issues } = result;
  const blocking = issues.filter((issue) => issue.level === "block");
  const warnings = issues.filter((issue) => issue.level === "warn");
  const hasIssues = issues.length > 0;
  const hasBlocking = blocking.length > 0;
  const hasTemplateFormat = issues.some((issue) => issue.category === "template_format");
  const [open, setOpen] = useState(hasIssues);

  const statusPill = !hasIssues ? (
    <span className="pill pill-success" style={{ height: 18 }}>Valid</span>
  ) : hasBlocking ? (
    <span className="pill pill-danger" style={{ height: 18 }}>
      <AlertCircle size={11} />
      {blocking.length} error{blocking.length !== 1 ? "s" : ""}
      {warnings.length > 0 ? ` · ${warnings.length} warn` : ""}
    </span>
  ) : (
    <span className="pill pill-warning" style={{ height: 18 }}>
      <AlertTriangle size={11} />
      {warnings.length} warning{warnings.length !== 1 ? "s" : ""}
    </span>
  );

  const iconBg = !hasIssues
    ? "var(--success-subtle)"
    : hasBlocking
      ? "var(--danger-subtle)"
      : "var(--warning-subtle)";
  const iconColor = !hasIssues
    ? "var(--success)"
    : hasBlocking
      ? "var(--danger)"
      : "var(--warning)";

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

      {open && hasIssues && (
        <div className="vf-body">
          {issues.map((issue) => (
            <div key={issue.id} className={`issue ${issue.level}`}>
              {issue.level === "warn" ? (
                <AlertTriangle size={14} className="iss-ic" />
              ) : (
                <AlertCircle size={14} className="iss-ic" />
              )}
              <div>
                <div style={{ fontSize: "var(--fs-body)", color: "var(--text)" }}>{issue.title}</div>
                {issue.location && issue.location !== "—" && (
                  <div className="iss-loc">{issue.location}</div>
                )}
                {issue.fix && <div className="iss-fix">{issue.fix}</div>}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {hasTemplateFormat && onDownloadTemplate && (
              <button
                type="button"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  height: 28, padding: "0 10px", background: "var(--surface)", color: "var(--text)",
                  border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)",
                  fontSize: "var(--fs-caption)", cursor: "pointer",
                }}
                onClick={onDownloadTemplate}
              >
                Download correct template
              </button>
            )}
            <button
              type="button"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
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
        </div>
      )}
    </div>
  );
}
