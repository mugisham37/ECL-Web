"use client";

import { Database, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarNav } from "./SidebarNav";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      style={{
        width: isCollapsed ? "var(--side-w-collapsed)" : "var(--side-w)",
        transition: "width var(--t-base) var(--ease-out)",
        height: "100vh",
        position: "sticky",
        top: 0,
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

      {/* Collapse toggle */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 12,
          borderTop: "1px solid var(--border)",
        }}
      >
        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: "9px 10px",
            borderRadius: "var(--r-sm)",
            color: "var(--text-subtle)",
            background: "none",
            border: 0,
            cursor: "pointer",
            fontSize: "var(--fs-caption)",
            width: "100%",
            transition: "background var(--t-micro), color var(--t-micro)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--surface-sunken)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "none";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-subtle)";
          }}
        >
          <ChevronLeft
            size={16}
            style={{
              flexShrink: 0,
              transition: "transform var(--t-base) var(--ease-out)",
              transform: isCollapsed ? "rotate(180deg)" : "none",
            }}
          />
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                style={{ overflow: "hidden", whiteSpace: "nowrap" }}
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </aside>
  );
}
