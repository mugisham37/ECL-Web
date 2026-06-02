"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Info, AlertCircle, X } from "lucide-react";
import type { ToastItem } from "@/lib/admin-types";

const ICONS = {
  success: CheckCircle,
  info:    Info,
  danger:  AlertCircle,
} as const;

const ICON_COLORS = {
  success: "var(--success)",
  info:    "var(--accent)",
  danger:  "var(--danger)",
} as const;

const AUTO_DISMISS_MS = 3200;

interface ToastStackProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

function ToastItemView({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  const Icon = ICONS[toast.kind];

  return (
    <motion.div
      className="toast"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      <Icon size={16} style={{ color: ICON_COLORS[toast.kind], flex: "none" }} aria-hidden />
      <span className="toast-grow">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        style={{
          width: 24, height: 24, border: 0, background: "none",
          color: "var(--text-subtle)", cursor: "pointer",
          display: "grid", placeItems: "center",
          borderRadius: "var(--r-sm)", flex: "none",
        }}
      >
        <X size={13} aria-hidden />
      </button>
    </motion.div>
  );
}

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="false">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItemView key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

let _toastId = 0;
export function makeToastId() { return `toast-${++_toastId}`; }
