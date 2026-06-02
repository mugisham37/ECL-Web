"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
  primaryLabel: string;
  primaryVariant?: "danger" | "primary";
  /** If provided, user must type this value to enable the confirm button */
  confirmInput?: string;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  icon,
  primaryLabel,
  primaryVariant = "primary",
  confirmInput,
}: ConfirmModalProps) {
  const [inputValue, setInputValue] = useState("");

  const canConfirm = confirmInput ? inputValue === confirmInput : true;

  const primaryBg = primaryVariant === "danger" ? "var(--danger)" : "var(--accent)";
  const primaryHover = primaryVariant === "danger" ? "#a83533" : "var(--accent-hover)";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          style={{
            position: "fixed", inset: 0, background: "var(--scrim)",
            zIndex: 80, display: "flex", alignItems: "center",
            justifyContent: "center", padding: 20,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          <motion.div
            style={{
              background: "var(--surface-raised)", border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)", padding: "clamp(20px,3vw,28px)",
              maxWidth: 440, width: "100%", boxShadow: "var(--shadow-modal)",
            }}
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
              <button
                onClick={onClose}
                style={{
                  width: 28, height: 28, border: 0, background: "none",
                  color: "var(--text-subtle)", display: "grid", placeItems: "center",
                  borderRadius: "var(--r-sm)", cursor: "pointer",
                }}
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            {/* Icon */}
            {icon && <div style={{ marginBottom: 14 }}>{icon}</div>}

            {/* Title */}
            <h3
              id="confirm-modal-title"
              style={{ fontSize: "var(--fs-h2)", fontWeight: "var(--fw-semibold)", color: "var(--text)" }}
            >
              {title}
            </h3>

            {/* Description */}
            <div
              style={{
                color: "var(--text-muted)", marginTop: 8,
                fontSize: "var(--fs-body)", lineHeight: 1.55,
              }}
            >
              {description}
            </div>

            {/* Optional confirmation input */}
            {confirmInput && (
              <input
                className="input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Type ${confirmInput}`}
                style={{ marginTop: 14, width: "100%" }}
                autoComplete="off"
              />
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1, height: "var(--control-h)", border: "1px solid var(--border-strong)",
                  borderRadius: "var(--r-sm)", background: "var(--surface)", color: "var(--text)",
                  fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)",
                  cursor: "pointer", transition: "background var(--t-micro)",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--surface-sunken)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--surface)")}
              >
                Cancel
              </button>
              <button
                onClick={() => { onConfirm(); setInputValue(""); }}
                disabled={!canConfirm}
                style={{
                  flex: 1, height: "var(--control-h)", border: "none",
                  borderRadius: "var(--r-sm)", background: primaryBg, color: "#fff",
                  fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)",
                  cursor: canConfirm ? "pointer" : "not-allowed",
                  opacity: canConfirm ? 1 : 0.5,
                  transition: "background var(--t-micro), opacity var(--t-micro)",
                }}
                onMouseEnter={(e) => { if (canConfirm) (e.currentTarget as HTMLButtonElement).style.background = primaryHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = primaryBg; }}
              >
                {primaryLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
