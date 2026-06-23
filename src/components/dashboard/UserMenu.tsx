"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Moon, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/providers/ThemeProvider";
import { signOut } from "next-auth/react";
import type { AppShellUser } from "@/lib/dashboard-types";

interface UserMenuProps {
  user: AppShellUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

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
        aria-label="Account menu"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: 4,
          borderRadius: "var(--r-full)",
          border: 0,
          background: "none",
          cursor: "pointer",
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
        <span className="avatar avatar-sm">{user.initials}</span>
        <ChevronDown
          size={13}
          style={{ color: "var(--text-subtle)" }}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="menu-pop"
          >
            {/* Profile summary */}
            <div className="mp-head">
              <p style={{ fontWeight: "var(--fw-semibold)" as React.CSSProperties["fontWeight"], fontSize: "var(--fs-body)", color: "var(--text)" }}>
                {user.name}
              </p>
              <p style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 2 }}>
                {user.email} · {user.role}
              </p>
            </div>

            <button className="mp-item" onClick={() => setOpen(false)}>
              <User size={15} className="mp-ic" />
              Account
            </button>

            {/* Dark mode toggle */}
            <button
              className="mp-item mp-toggle"
              onClick={(e) => {
                // Don't close if clicking the switch itself — the switch handles it
                if ((e.target as HTMLElement).closest(".switch")) return;
                setTheme(isDark ? "light" : "dark");
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Moon size={15} className="mp-ic" />
                Dark mode
              </span>
              <label className="switch" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
                />
                <span className="track" />
              </label>
            </button>

            <div className="mp-sep" />

            <button
              className="mp-item danger"
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
            >
              <LogOut size={15} className="mp-ic" />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
