"use client";

import { Database } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarNav } from "./SidebarNav";

interface SidebarProps {
  isCollapsed: boolean;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  return (
    <aside
      style={{
        width: isCollapsed ? "var(--side-w-collapsed)" : "var(--side-w)",
        transition: "width var(--t-base) var(--ease-out)",
        height: "100%",
        minHeight: 0,
        overflowX: "hidden",
        overflowY: "auto",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "12px 10px",
        zIndex: 31,
      }}
    >
      {/* Brand */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "6px 8px 14px",
          overflow: "hidden",
        }}
      >
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

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                fontWeight: "var(--fw-semibold)" as React.CSSProperties["fontWeight"],
                fontSize: "var(--fs-body)",
                color: "var(--text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              ECL Platform
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1 }}>
        <SidebarNav isCollapsed={isCollapsed} />
      </div>

    </aside>
  );
}
