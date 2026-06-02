"use client";

import { Plus, Sparkles, Info } from "lucide-react";
import { CollateralRow } from "../collateral/CollateralRow";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import type { CollateralType, ModalKind } from "@/lib/admin-types";
import { COMMON_COLLATERAL } from "@/lib/admin-mock";

interface CollateralSectionProps {
  collateral: CollateralType[];
  modal: ModalKind;
  onUpdate: (items: CollateralType[]) => void;
  onMarkDirty: () => void;
  onToast: (msg: string, kind?: "success" | "info" | "danger") => void;
  onSetModal: (m: ModalKind) => void;
}

function validateRow(item: CollateralType) {
  const hc = Number(item.haircut);
  const ttr = Number(item.timeToRealize);
  return {
    haircut: item.haircut !== (undefined as unknown) && (isNaN(hc) || hc < 0 || hc > 100),
    ttr: item.timeToRealize !== (undefined as unknown) && (isNaN(ttr) || ttr < 0),
  };
}

export function CollateralSection({ collateral, modal, onUpdate, onMarkDirty, onToast, onSetModal }: CollateralSectionProps) {
  const errors = collateral.map((c) => validateRow(c));
  const hasErrors = errors.some((e) => e.haircut || e.ttr);

  function addCommon() {
    const existing = collateral.map((c) => c.name.toLowerCase());
    const toAdd = COMMON_COLLATERAL.filter(([n]) => !existing.includes(n.toLowerCase()));
    if (toAdd.length === 0) { onToast("All common types already added.", "info"); return; }
    const newItems: CollateralType[] = toAdd.map(([n, h, t]) => ({ id: `c-${Date.now()}-${n}`, name: n, haircut: h, timeToRealize: t }));
    onUpdate([...collateral, ...newItems]);
    onMarkDirty();
  }

  function addRow() {
    onUpdate([...collateral, { id: `c-${Date.now()}`, name: "", haircut: 0, timeToRealize: 0 }]);
    onMarkDirty();
  }

  function updateRow(index: number, field: keyof CollateralType, value: string | number) {
    onUpdate(collateral.map((c, i) => i === index ? { ...c, [field]: value } : c));
    onMarkDirty();
  }

  function confirmDelete() {
    if (modal?.type !== "collateral-delete") return;
    const { item, index } = modal;
    onUpdate(collateral.filter((_, i) => i !== index));
    onToast(`${item.name} deleted.`, "info");
    onSetModal(null);
  }

  return (
    <section className="admin-sec active" aria-labelledby="collateral-heading">
      <div className="sec-title-row">
        <div>
          <h2 id="collateral-heading">Collateral &amp; haircuts</h2>
          <p className="desc">The LGD engine discounts each collateral type by its haircut and time to realization.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="admin-editable">
          <button onClick={addCommon} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 32, padding: "0 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", background: "var(--surface)", color: "var(--text-muted)", fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", cursor: "pointer" }}>
            <Sparkles size={13} aria-hidden /> Add common
          </button>
          <button onClick={addRow} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: "var(--control-h)", padding: "0 14px", border: "none", borderRadius: "var(--r-sm)", background: "var(--accent)", color: "#fff", fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)", cursor: "pointer" }}>
            <Plus size={15} aria-hidden /> Add type
          </button>
        </div>
      </div>
      <hr className="sec-divider" />

      <div className="callout" style={{ marginBottom: "var(--sp-4)", display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", borderRadius: "var(--r-md)", background: "var(--info-subtle)" }}>
        <Info size={15} style={{ color: "var(--info)", flexShrink: 0, marginTop: 1 }} aria-hidden />
        <span style={{ fontSize: "var(--fs-body)", color: "var(--text-muted)" }}>Changes apply to <strong>future runs only</strong>. Haircut must be 0–100%; time to realize is in months.</span>
      </div>

      <div className="admin-table-wrap tbl-wrap admin-editable">
        <table className="tbl" aria-label="Collateral types">
          <thead>
            <tr>
              <th style={{ paddingLeft: 16 }}>Collateral type</th>
              <th className="num" style={{ width: 140 }}>Haircut</th>
              <th className="num" style={{ width: 160 }}>Time to realize</th>
              <th style={{ width: 48 }} />
            </tr>
          </thead>
          <tbody>
            {collateral.map((item, i) => (
              <CollateralRow
                key={item.id}
                item={item}
                errors={errors[i] ?? {}}
                onChange={(field, value) => updateRow(i, field, value)}
                onDelete={() => onSetModal({ type: "collateral-delete", item, index: i })}
              />
            ))}
          </tbody>
        </table>
      </div>

      {hasErrors && (
        <div className="cell-err">
          <Info size={13} aria-hidden /> Haircut must be 0–100%; time to realize must be 0 or more.
        </div>
      )}

      <ConfirmModal
        open={modal?.type === "collateral-delete"}
        onClose={() => onSetModal(null)}
        onConfirm={confirmDelete}
        title={modal?.type === "collateral-delete" ? `Delete "${modal.item.name}"?` : ""}
        description="Loans referencing this collateral type in future uploads will fail validation until it's re-added. Past runs are unaffected."
        primaryLabel="Delete type"
        primaryVariant="danger"
      />
    </section>
  );
}
