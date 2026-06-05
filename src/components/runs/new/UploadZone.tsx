"use client";

import { useRef, useState } from "react";
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
  onAdd: (file: File) => void;
  onRemove: (id: string) => void;
  onDownloadTemplate?: () => void;
}

export function UploadZone({ type, files, onAdd, onRemove, onDownloadTemplate }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const meta = ZONE_META[type];
  const showDropzone = meta.multi || files.length === 0;

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    picked.forEach(onAdd);
    // Reset so the same file can be re-selected after removal
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.name.endsWith(".xlsx") || f.name.endsWith(".xls"),
    );
    if (meta.multi) {
      dropped.forEach(onAdd);
    } else if (dropped.length > 0) {
      onAdd(dropped[0]);
    }
  }

  return (
    <div className="upload-zone">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        multiple={meta.multi}
        style={{ display: "none" }}
        onChange={handleFileInput}
        aria-hidden="true"
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
        {showDropzone && (
          <div
            className={`dz${isDragOver ? " over" : ""}`}
            role="button"
            tabIndex={0}
            onClick={openPicker}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onKeyDown={(e) => e.key === "Enter" && openPicker()}
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
