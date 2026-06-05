"use client";

import { useRef } from "react";
import { Plus, Sparkles, Info, AlertTriangle, Ban } from "lucide-react";
import { SegmentRow } from "../segments/SegmentRow";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import type { AdminSegment, ModalKind } from "@/lib/admin-types";
const COMMON_SEGMENTS = ["Transport", "Education", "Agriculture", "Trade", "Manufacturing", "Real Estate", "Personal", "SME"];

interface SegmentsSectionProps {
  segments: AdminSegment[];
  modal: ModalKind;
  onUpdate: (segs: AdminSegment[]) => void;
  onMarkDirty: () => void;
  onToast: (msg: string, kind?: "success" | "info" | "danger") => void;
  onSetModal: (m: ModalKind) => void;
}

export function SegmentsSection({ segments, modal, onUpdate, onMarkDirty, onToast, onSetModal }: SegmentsSectionProps) {
  const tableRef = useRef<HTMLTableSectionElement>(null);

  function addSegment() {
    const newId = `s-${Date.now()}`;
    onUpdate([...segments, { id: newId, name: "", code: "", runsCount: 0, disabled: false }]);
    onMarkDirty();
    setTimeout(() => {
      const inputs = tableRef.current?.querySelectorAll<HTMLInputElement>(".seg-name-input");
      inputs?.[inputs.length - 1]?.focus();
    }, 30);
  }

  function addCommon() {
    const existing = segments.map((s) => s.name.toLowerCase());
    const toAdd = COMMON_SEGMENTS.filter((n) => !existing.includes(n.toLowerCase()));
    if (toAdd.length === 0) { onToast("All common segments already added.", "info"); return; }
    const newSegs = toAdd.map((n) => ({ id: `s-${Date.now()}-${n}`, name: n, code: n.slice(0, 3).toUpperCase(), runsCount: 0, disabled: false }));
    onUpdate([...segments, ...newSegs]);
    onMarkDirty();
  }

  function updateRow(index: number, field: keyof AdminSegment, value: string) {
    onUpdate(segments.map((s, i) => i === index ? { ...s, [field]: value } : s));
    onMarkDirty();
  }

  function toggleDisable(index: number) {
    const s = segments[index];
    onUpdate(segments.map((x, i) => i === index ? { ...x, disabled: !x.disabled } : x));
    onToast(`${s.name} ${s.disabled ? "enabled" : "disabled"} for new runs.`, "info");
  }

  function requestDelete(index: number) {
    const s = segments[index];
    if (s.runsCount > 0) {
      onSetModal({ type: "segment-delete-guard", segment: s, index });
    } else {
      onSetModal({ type: "segment-delete-confirm", segment: s, index });
    }
  }

  function confirmDeleteGuard() {
    if (modal?.type !== "segment-delete-guard") return;
    const { segment, index } = modal;
    onUpdate(segments.map((s, i) => i === index ? { ...s, disabled: true } : s));
    onToast(`${segment.name} disabled for new runs.`, "info");
    onSetModal(null);
  }

  function confirmDelete() {
    if (modal?.type !== "segment-delete-confirm") return;
    const { segment, index } = modal;
    onUpdate(segments.filter((_, i) => i !== index));
    onToast(`${segment.name} deleted.`, "info");
    onSetModal(null);
  }

  return (
    <section className="admin-sec active" aria-labelledby="segments-heading">
      <div className="sec-title-row">
        <div>
          <h2 id="segments-heading">Segments</h2>
          <p className="desc">Portfolios you compute ECL for. Each has its own PD transition matrix.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="admin-editable">
          <button onClick={addCommon} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 32, padding: "0 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", background: "var(--surface)", color: "var(--text-muted)", fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", cursor: "pointer" }}>
            <Sparkles size={13} aria-hidden /> Add common
          </button>
          <button onClick={addSegment} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: "var(--control-h)", padding: "0 14px", border: "none", borderRadius: "var(--r-sm)", background: "var(--accent)", color: "#fff", fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)", cursor: "pointer" }}>
            <Plus size={15} aria-hidden /> Add segment
          </button>
        </div>
      </div>
      <hr className="sec-divider" />

      <div className="callout callout-info" style={{ marginBottom: "var(--sp-4)", display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", borderRadius: "var(--r-md)", background: "var(--info-subtle)" }}>
        <Info size={15} style={{ color: "var(--info)", flexShrink: 0, marginTop: 1 }} aria-hidden />
        <span style={{ fontSize: "var(--fs-body)", color: "var(--text-muted)" }}>Changes apply to <strong>future runs only</strong>. Past runs keep the segments they were computed with.</span>
      </div>

      <div className="admin-table-wrap tbl-wrap admin-editable">
        <table className="tbl" aria-label="Segments">
          <thead>
            <tr>
              <th>Segment</th>
              <th style={{ width: 120 }}>Code</th>
              <th className="num">Used in runs</th>
              <th>Status</th>
              <th style={{ width: 48 }} />
            </tr>
          </thead>
          <tbody ref={tableRef}>
            {segments.map((s, i) => (
              <SegmentRow
                key={s.id}
                segment={s}
                onChange={(field, value) => updateRow(i, field, value)}
                onToggleDisable={() => toggleDisable(i)}
                onDelete={() => requestDelete(i)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <ConfirmModal
        open={modal?.type === "segment-delete-confirm"}
        onClose={() => onSetModal(null)}
        onConfirm={confirmDelete}
        title={modal?.type === "segment-delete-confirm" ? `Delete "${modal.segment.name}"?` : ""}
        description="This segment hasn't been used in any run, so it's safe to delete."
        primaryLabel="Delete"
        primaryVariant="danger"
      />

      {modal?.type === "segment-delete-guard" && (
        <div style={{ position: "fixed", inset: 0, background: "var(--scrim)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => onSetModal(null)} role="dialog" aria-modal="true">
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "clamp(20px,3vw,28px)", maxWidth: 440, width: "100%", boxShadow: "var(--shadow-modal)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--warning-subtle)", color: "var(--warning)", display: "grid", placeItems: "center", marginBottom: 14 }}>
              <AlertTriangle size={20} aria-hidden />
            </div>
            <h3 style={{ fontSize: "var(--fs-h2)", fontWeight: "var(--fw-semibold)" }}>"{modal.segment.name}" is used in {modal.segment.runsCount} runs</h3>
            <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: "var(--fs-body)", lineHeight: 1.55 }}>Deleting it would break those runs' history. Disable it instead — it stays out of new runs but keeps past results intact.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              <button onClick={confirmDeleteGuard} style={{ height: "var(--control-h)", border: "none", borderRadius: "var(--r-sm)", background: "var(--accent)", color: "#fff", fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Ban size={14} aria-hidden /> Disable for new runs
              </button>
              <button onClick={() => onSetModal(null)} style={{ height: "var(--control-h)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", background: "var(--surface)", color: "var(--text)", fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)", cursor: "pointer" }}>
                Keep segment
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
