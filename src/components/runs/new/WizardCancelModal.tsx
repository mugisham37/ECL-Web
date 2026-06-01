"use client";

import { AnimatePresence, motion } from "framer-motion";

interface WizardCancelModalProps {
  open: boolean;
  onKeep: () => void;
  onDiscard: () => void;
}

export function WizardCancelModal({ open, onKeep, onDiscard }: WizardCancelModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onKeep}
          style={{
            position: "fixed", inset: 0, background: "var(--scrim)",
            zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface-raised)", border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)", padding: "clamp(20px,3vw,28px)",
              maxWidth: 400, width: "100%", boxShadow: "var(--shadow-modal)",
            }}
          >
            <h3
              id="cancel-modal-title"
              style={{ fontSize: "var(--fs-h2)", fontWeight: "var(--fw-semibold)", color: "var(--text)" }}
            >
              Discard this run?
            </h3>
            <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: "var(--fs-body)", lineHeight: 1.5 }}>
              Your uploaded files and progress will be discarded. This can&apos;t be undone.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={onKeep}
                style={{
                  flex: 1, height: "var(--control-h)", border: "1px solid var(--border-strong)",
                  borderRadius: "var(--r-sm)", background: "var(--surface)", color: "var(--text)",
                  fontSize: "var(--fs-body)", cursor: "pointer",
                }}
              >
                Keep editing
              </button>
              <button
                onClick={onDiscard}
                style={{
                  flex: 1, height: "var(--control-h)", border: "none",
                  borderRadius: "var(--r-sm)", background: "var(--danger)", color: "#fff",
                  fontSize: "var(--fs-body)", cursor: "pointer",
                }}
              >
                Discard run
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
