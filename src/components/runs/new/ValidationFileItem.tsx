"use client";

import { useState } from "react";
import { File, ChevronDown, AlertTriangle, AlertCircle, RefreshCw, Check } from "lucide-react";
import type { PdPreviewResult, ValidationFileResult } from "@/lib/new-run-types";
import { PdValidationPanel } from "./pd/PdValidationPanel";
import { countPdCriteria } from "@/lib/api/pd-validation";

interface ValidationFileItemProps {
  result: ValidationFileResult;
  zoneLabel: string;
  onReupload: (newFile: File) => void;
  isReuploading?: boolean;
  onDownloadTemplate?: () => void;
  pdPreview?: PdPreviewResult | null;
  extraFileCount?: number;
}

export function ValidationFileItem({
  result,
  zoneLabel,
  onReupload,
  isReuploading,
  onDownloadTemplate,
  pdPreview,
  extraFileCount = 0,
}: ValidationFileItemProps) {
  const { file, issues } = result;
  const blocking = issues.filter((issue) => issue.level === "block");
  const warnings = issues.filter((issue) => issue.level === "warn");
  const hasIssues = issues.length > 0;
  const hasBlocking = blocking.length > 0;
  const hasTemplateFormat = issues.some((issue) => issue.category === "template_format");
  const isPdPreview = !!pdPreview && file.type === "PD";
  const [open, setOpen] = useState(hasIssues || isPdPreview);
  const expandable = hasIssues || isPdPreview;

  const pdCounts = pdPreview ? countPdCriteria(pdPreview.criteria) : null;
  const pdStatus = pdPreview?.status;

  const statusPill = isPdPreview && pdCounts ? (
    pdStatus === "blocking" || pdCounts.blocked > 0 ? (
      <span className="pill pill-danger" style={{ height: 18 }}>
        <AlertCircle size={11} />
        {pdCounts.blocked} blocking
      </span>
    ) : pdStatus === "warn" || pdCounts.review > 0 ? (
      <span className="pill pill-warning" style={{ height: 18 }}>
        <AlertTriangle size={11} />
        {pdCounts.passed} passed · {pdCounts.review} to review
      </span>
    ) : (
      <span className="pill pill-success" style={{ height: 18 }}>
        <span className="dot" />
        Validated
      </span>
    )
  ) : !hasIssues ? (
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

  const pdIsBlocking = isPdPreview && (pdStatus === "blocking" || (pdCounts?.blocked ?? 0) > 0);
  const pdIsWarn = isPdPreview && !pdIsBlocking && (pdStatus === "warn" || (pdCounts?.review ?? 0) > 0);
  const iconBg = pdIsBlocking || hasBlocking
    ? "var(--danger-subtle)"
    : pdIsWarn || (hasIssues && !hasBlocking)
      ? "var(--warning-subtle)"
      : "var(--success-subtle)";
  const iconColor = pdIsBlocking || hasBlocking
    ? "var(--danger)"
    : pdIsWarn || (hasIssues && !hasBlocking)
      ? "var(--warning)"
      : "var(--success)";

  function toggle() {
    if (expandable) setOpen((v) => !v);
  }

  return (
    <div className={`val-file${open ? " open" : ""}${isPdPreview ? " pd-rich" : ""}`}>
      <div
        className="vf-head"
        onClick={toggle}
        role={expandable ? "button" : undefined}
        tabIndex={expandable ? 0 : undefined}
        aria-expanded={expandable ? open : undefined}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && expandable) {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <span className="vf-ic" style={{ background: iconBg, color: iconColor }}>
          {pdIsBlocking || hasBlocking ? <AlertCircle size={13} /> : isPdPreview || !hasIssues ? <Check size={13} /> : <File size={13} />}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="vf-name">
            {file.type === "PD" ? `PD · ${file.name}` : file.name}
            {extraFileCount > 0 && (
              <span className="muted" style={{ fontWeight: 400 }}> + {extraFileCount} more</span>
            )}
          </div>
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
          {expandable && <ChevronDown size={15} className="vf-chev" />}
        </div>
      </div>

      {open && isPdPreview && pdPreview && (
        <div className="vf-body">
          <PdValidationPanel preview={pdPreview} />
        </div>
      )}

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
