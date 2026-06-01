"use client";

import { useState, useRef, useEffect } from "react";
import { Database, ChevronDown, Check, Settings } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Tenant } from "@/lib/dashboard-types";

interface TenantMenuProps {
  activeTenant: Tenant;
  allTenants: Tenant[];
  onSwitch: (t: Tenant) => void;
}

export function TenantMenu({ activeTenant, allTenants, onSwitch }: TenantMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "6px 10px",
          borderRadius: "var(--r-sm)",
          cursor: "pointer",
          border: "1px solid transparent",
          background: "none",
          color: "var(--text)",
          maxWidth: 260,
          transition: "background var(--t-micro)",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            "var(--surface-sunken)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = "none")
        }
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: "var(--accent)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <Database size={13} />
        </span>
        <span
          style={{
            fontWeight: "var(--fw-semibold)" as React.CSSProperties["fontWeight"],
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "var(--fs-body)",
          }}
          className="hidden sm:inline"
        >
          {activeTenant.name}
        </span>
        <ChevronDown size={13} style={{ color: "var(--text-subtle)", flexShrink: 0 }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="menu-pop"
            style={{ minWidth: 240 }}
          >
            <div className="mp-head">
              <p style={{ fontSize: "var(--fs-micro)", color: "var(--text-subtle)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "var(--tracking-caps)" }}>
                Switch tenant
              </p>
            </div>

            {allTenants.map((t) => (
              <button
                key={t.id}
                className="mp-item"
                style={{ justifyContent: "space-between" }}
                onClick={() => { onSwitch(t); setOpen(false); }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    className="avatar avatar-sm"
                    style={{ background: "var(--surface-sunken)", color: "var(--text-muted)" }}
                  >
                    {t.initials ?? t.name.slice(0, 2).toUpperCase()}
                  </span>
                  {t.name}
                </span>
                {t.id === activeTenant.id && (
                  <Check size={14} style={{ color: "var(--accent)" }} />
                )}
              </button>
            ))}

            <div className="mp-sep" />
            <button className="mp-item">
              <Settings size={15} className="mp-ic" />
              Tenant settings
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
