"use client";

import { AlertTriangle, RefreshCw, Trash2, RotateCcw, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type ModalKind = "more" | "delete" | "rerun" | "restore" | null;

interface RunActionModalProps {
  kind: ModalKind;
  onClose: () => void;
  onAction?: (action: "delete" | "rerun" | "restore") => void;
}

interface MoreMenuItem {
  label: string;
  icon: React.ElementType;
  danger?: boolean;
  action: "rerun" | "delete";
}

const MORE_ITEMS: MoreMenuItem[] = [
  { label: "Re-run with same inputs", icon: RefreshCw, action: "rerun" },
  { label: "Soft-delete run", icon: Trash2, danger: true, action: "delete" },
];

export function RunActionModal({ kind, onClose, onAction }: RunActionModalProps) {
  function handleAction(action: "delete" | "rerun" | "restore") {
    onAction?.(action);
    onClose();
  }

  function BtnSecondary({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    return (
      <button
        onClick={onClick ?? onClose}
        style={{ flex: 1, height: "var(--control-h)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", background: "var(--surface)", color: "var(--text)", fontSize: "var(--fs-body)", cursor: "pointer" }}
      >
        {children}
      </button>
    );
  }

  function BtnPrimary({ children, onClick, danger }: { children: React.ReactNode; onClick?: () => void; danger?: boolean }) {
    return (
      <button
        onClick={onClick}
        style={{ flex: 1, height: "var(--control-h)", border: "none", borderRadius: "var(--r-sm)", background: danger ? "var(--danger)" : "var(--accent)", color: "#fff", fontSize: "var(--fs-body)", cursor: "pointer" }}
      >
        {children}
      </button>
    );
  }

  function IconWrap({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
    return (
      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, color, display: "grid", placeItems: "center", marginBottom: 14 }}>
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {kind && (
        <motion.div
          key="scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: "fixed", inset: 0, background: "var(--scrim)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "clamp(20px,3vw,28px)", maxWidth: 420, width: "100%", boxShadow: "var(--shadow-modal)" }}
          >
            {/* Close btn */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
              <button onClick={onClose} style={{ width: 28, height: 28, border: 0, background: "none", color: "var(--text-subtle)", display: "grid", placeItems: "center", borderRadius: "var(--r-sm)", cursor: "pointer" }} aria-label="Close">
                <X size={15} />
              </button>
            </div>

            {kind === "more" && (
              <>
                <h3 style={{ fontSize: "var(--fs-h2)", fontWeight: "var(--fw-semibold)", color: "var(--text)", marginBottom: 14 }}>Run actions</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {MORE_ITEMS.map((item) => (
                    <button
                      key={item.action}
                      onClick={() => handleAction(item.action)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: "var(--r-sm)", border: "1px solid var(--border)", background: "var(--surface)", color: item.danger ? "var(--danger)" : "var(--text)", fontSize: "var(--fs-body)", cursor: "pointer", width: "100%", textAlign: "left" }}
                    >
                      <item.icon size={15} style={{ color: item.danger ? "var(--danger)" : "var(--text-subtle)" }} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {kind === "delete" && (
              <>
                <IconWrap color="var(--warning)" bg="var(--warning-subtle)"><AlertTriangle size={20} /></IconWrap>
                <h3 style={{ fontSize: "var(--fs-h2)", fontWeight: "var(--fw-semibold)", color: "var(--text)" }}>Soft-delete this run?</h3>
                <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: "var(--fs-body)", lineHeight: 1.5 }}>
                  The run is hidden from lists but retained for 7 years for audit. You can restore it anytime.
                </p>
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <BtnSecondary>Cancel</BtnSecondary>
                  <BtnPrimary danger onClick={() => handleAction("delete")}>Soft-delete</BtnPrimary>
                </div>
              </>
            )}

            {kind === "rerun" && (
              <>
                <IconWrap color="var(--accent)" bg="var(--accent-subtle)"><RefreshCw size={20} /></IconWrap>
                <h3 style={{ fontSize: "var(--fs-h2)", fontWeight: "var(--fw-semibold)", color: "var(--text)" }}>Re-run with the same inputs?</h3>
                <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: "var(--fs-body)", lineHeight: 1.5 }}>
                  A new run will be created using the identical input hashes on the same engine version. The result should be byte-identical — this verifies reproducibility.
                </p>
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <BtnSecondary>Cancel</BtnSecondary>
                  <BtnPrimary onClick={() => handleAction("rerun")}>Start re-run</BtnPrimary>
                </div>
              </>
            )}

            {kind === "restore" && (
              <>
                <IconWrap color="var(--accent)" bg="var(--accent-subtle)"><RotateCcw size={20} /></IconWrap>
                <h3 style={{ fontSize: "var(--fs-h2)", fontWeight: "var(--fw-semibold)", color: "var(--text)" }}>Restore this run?</h3>
                <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: "var(--fs-body)", lineHeight: 1.5 }}>
                  It will reappear in the runs list and results. The audit trail records the restore.
                </p>
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <BtnSecondary>Cancel</BtnSecondary>
                  <BtnPrimary onClick={() => handleAction("restore")}>Restore run</BtnPrimary>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
