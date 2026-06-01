"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Database } from "lucide-react";
import { SidebarNav } from "./SidebarNav";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "var(--scrim)",
              zIndex: 40,
            }}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              height: "100%",
              width: "var(--side-w)",
              background: "var(--surface)",
              borderRight: "1px solid var(--border)",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              padding: "12px 10px",
              boxShadow: "var(--shadow-modal)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 8px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "var(--accent)",
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  <Database size={14} />
                </span>
                <span
                  style={{
                    fontWeight: "var(--fw-semibold)" as React.CSSProperties["fontWeight"],
                    fontSize: "var(--fs-body)",
                    color: "var(--text)",
                  }}
                >
                  ECL Platform
                </span>
              </div>

              <button
                onClick={onClose}
                aria-label="Close menu"
                style={{
                  width: 32,
                  height: 32,
                  border: 0,
                  background: "none",
                  color: "var(--text-subtle)",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "var(--r-sm)",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <SidebarNav onLinkClick={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
