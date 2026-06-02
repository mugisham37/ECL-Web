import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";

interface SaveBarProps {
  visible: boolean;
  message: string;
  onSave: () => void;
  onDiscard: () => void;
  saving?: boolean;
}

export function SaveBar({ visible, message, onSave, onDiscard, saving = false }: SaveBarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={{
            position: "fixed", left: 0, right: 0, bottom: 0,
            zIndex: 70, padding: "0 var(--gutter) 16px",
            display: "flex", justifyContent: "center", pointerEvents: "none",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="save-bar"
            style={{ pointerEvents: "auto", maxWidth: 760, width: "100%" }}
          >
            <span className="sb-msg">
              <Info size={14} style={{ color: "var(--warning)", flex: "none" }} aria-hidden />
              {message}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <button
                onClick={onDiscard}
                style={{
                  height: "var(--control-h)", padding: "0 14px",
                  border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)",
                  background: "var(--surface)", color: "var(--text)",
                  fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)",
                  cursor: "pointer", transition: "background var(--t-micro)",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--surface-sunken)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--surface)")}
              >
                Discard
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                style={{
                  height: "var(--control-h)", padding: "0 14px",
                  border: "none", borderRadius: "var(--r-sm)",
                  background: "var(--accent)", color: "#fff",
                  fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  transition: "background var(--t-micro)",
                }}
                onMouseEnter={(e) => { if (!saving) (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-hover)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)"; }}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
