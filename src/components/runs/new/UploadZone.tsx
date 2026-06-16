"use client";

import { useId, useState } from "react";
import { Upload, Download } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { UploadFilePill } from "./shared/UploadFilePill";
import type { UploadedFile, FileInputType } from "@/lib/new-run-types";

function isExcelFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith(".xlsx") || name.endsWith(".xls");
}

const ZONE_META: Record<FileInputType, { title: string; sub: string; multi: boolean; sizeHint: string }> = {
  PD:  { title: "Probability of Default", sub: "Monthly loan listings — multiple files are combined",           multi: true,  sizeHint: "Up to 10 files · 25 MB each" },
  LGD: { title: "Loss Given Default",     sub: "Collateral register with customer linkage — one file per run",  multi: false, sizeHint: "Single workbook · 25 MB" },
  EAD: { title: "Exposure at Default",    sub: "Balances & schedules for the rundown — one file per run",       multi: false, sizeHint: "Single workbook · 25 MB" },
};

interface UploadZoneProps {
  type: FileInputType;
  files: UploadedFile[];
  onAdd: (file: File) => void;
  onRemove: (id: string) => void;
  onDownloadTemplate?: () => void;
}

export function UploadZone({ type, files, onAdd, onRemove, onDownloadTemplate }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputId = useId();
  const meta = ZONE_META[type];
  const isReplace = !meta.multi && files.length > 0;

  function addFiles(picked: File[]) {
    const excelFiles = picked.filter(isExcelFile);
    if (meta.multi) {
      excelFiles.forEach(onAdd);
    } else if (excelFiles.length > 0) {
      onAdd(excelFiles[0]);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(e.target.files ?? []));
    // Reset so the same file can be re-selected after removal
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  }

  return (
    <div className="upload-zone">
      {/* Hidden file input — linked to drop zone label for reliable browse */}
      <input
        id={inputId}
        type="file"
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        multiple={meta.multi}
        className="sr-only"
        onChange={handleFileInput}
        tabIndex={-1}
      />

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
          type="button"
          onClick={onDownloadTemplate}
          disabled={!onDownloadTemplate}
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            height: 28, padding: "0 10px", marginLeft: "auto",
            background: "none", border: "1px solid var(--border)", borderRadius: "var(--r-sm)",
            fontSize: "var(--fs-caption)", color: "var(--text-muted)", cursor: onDownloadTemplate ? "pointer" : "default",
            transition: "background var(--t-micro)", opacity: onDownloadTemplate ? 1 : 0.5,
          }}
          onMouseEnter={(e) => onDownloadTemplate && ((e.currentTarget as HTMLButtonElement).style.background = "var(--surface-sunken)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "none")}
        >
          <Download size={12} />
          Template
        </button>
      </div>

      {/* Zone body */}
      <div className="uz-body">
        <label
          htmlFor={inputId}
          className={`dz${isDragOver ? " over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          aria-label={`Upload ${type} file${meta.multi ? "s" : ""}`}
        >
          <Upload size={26} className="dz-ic" aria-hidden="true" />
          <div style={{ fontSize: "var(--fs-body)", color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--text)" }}>
              {isReplace
                ? "Drop to replace"
                : meta.multi
                ? "Drop .xlsx files"
                : "Drop one .xlsx file"}
            </strong>{" "}
            or{" "}
            <span className="link-accent">browse</span>
          </div>
          <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-subtle)" }}>
            {isReplace
              ? "Drop a new file to replace the current one"
              : meta.sizeHint}
          </span>
        </label>

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
