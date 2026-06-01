"use client";

import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { UploadFilePill } from "./shared/UploadFilePill";
import type { UploadedFile, FileInputType } from "@/lib/new-run-types";

const ZONE_META: Record<FileInputType, { title: string; sub: string; multi: boolean; sizeHint: string }> = {
  PD:  { title: "Probability of Default", sub: "Monthly loan listings — multiple files are combined",    multi: true,  sizeHint: "Up to 10 files · 25 MB each" },
  LGD: { title: "Loss Given Default",     sub: "Collateral register with customer linkage",              multi: false, sizeHint: "Single workbook · 25 MB" },
  EAD: { title: "Exposure at Default",    sub: "Balances & schedules for the rundown",                   multi: false, sizeHint: "Single workbook · 25 MB" },
};

interface UploadZoneProps {
  type: FileInputType;
  files: UploadedFile[];
  onAdd: (file: UploadedFile) => void;
  onRemove: (id: string) => void;
}

export function UploadZone({ type, files, onAdd, onRemove }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const meta = ZONE_META[type];
  const showDropzone = meta.multi || files.length === 0;

  function handleClick() {
    // Simulate adding a file (in production this opens a file picker)
    if (type === "PD" && files.length === 1 && !files.find((f) => f.name === "PD_branch4.xlsx")) {
      onAdd({ id: `pd-extra-${Date.now()}`, name: "PD_branch4.xlsx", size: "1.1 MB", sheets: 1, type: "PD", status: "warn", hash: "7d10…b8e4" });
    }
  }

  return (
    <div className="upload-zone">
      {/* Zone header */}
      <div className="uz-head">
        <span className="uz-badge" aria-label={`${type} input type`}>{type}</span>
        <div className="uz-meta">
          <div className="uz-t">
            {meta.title}
            {meta.multi && (
              <span
                style={{
                  display: "inline-flex", alignItems: "center", height: 18, padding: "0 7px",
                  borderRadius: "var(--r-sm)", background: "var(--surface-sunken)", border: "1px solid var(--border)",
                  fontSize: "var(--fs-micro)", color: "var(--text-subtle)", fontFamily: "var(--font-mono)",
                  textTransform: "uppercase", letterSpacing: "var(--tracking-caps)",
                }}
              >
                multi-file
              </span>
            )}
          </div>
          <div className="uz-d">{meta.sub}</div>
        </div>
        <button
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            height: 28, padding: "0 10px", marginLeft: "auto",
            background: "none", border: "1px solid var(--border)", borderRadius: "var(--r-sm)",
            fontSize: "var(--fs-caption)", color: "var(--text-muted)", cursor: "pointer",
            transition: "background var(--t-micro)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--surface-sunken)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "none")}
        >
          <Download size={12} />
          Template
        </button>
      </div>

      {/* Zone body */}
      <div className="uz-body">
        {showDropzone && (
          <div
            className={`dz${isDragOver ? " over" : ""}`}
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleClick(); }}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
            aria-label={`Upload ${type} file${meta.multi ? "s" : ""}`}
          >
            <Upload size={26} className="dz-ic" aria-hidden="true" />
            <div style={{ fontSize: "var(--fs-body)", color: "var(--text-muted)" }}>
              <strong style={{ color: "var(--text)" }}>
                {meta.multi ? "Drop .xlsx files" : "Drop one .xlsx file"}
              </strong>{" "}
              or{" "}
              <span className="link-accent">browse</span>
            </div>
            <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-subtle)" }}>
              {meta.sizeHint}
            </span>
          </div>
        )}

        {/* Uploaded files */}
        <div className="uz-files">
          <AnimatePresence initial={false}>
            {files.map((file) => (
              <UploadFilePill key={file.id} file={file} onRemove={onRemove} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
