"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, AlertTriangle, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Notification } from "@/lib/dashboard-types";

interface NotificationsDropdownProps {
  notifications: Notification[];
}

export function NotificationsDropdown({ notifications }: NotificationsDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function KindIcon({ kind }: { kind: Notification["kind"] }) {
    if (kind === "ok") return <Check size={13} />;
    if (kind === "warn") return <AlertTriangle size={13} />;
    return <User size={13} />;
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="topbar-icon-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={open}
      >
        <Bell size={18} />
        {unreadCount > 0 && <span className="dot-badge" aria-hidden="true" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="menu-pop notif-pop"
          >
            <div className="mp-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "var(--fs-body)", fontWeight: "var(--fw-semibold)", color: "var(--text)" }}>
                Notifications
              </p>
              <button
                style={{ background: "none", border: 0, cursor: "pointer", fontSize: "var(--fs-caption)", color: "var(--accent)" }}
              >
                Mark all read
              </button>
            </div>

            {notifications.map((n) => (
              <div key={n.id} className="notif-item">
                <span className={`ni-ic ${n.kind}`}>
                  <KindIcon kind={n.kind} />
                </span>
                <div className="ni-body">
                  <p className="ni-t">{n.title}</p>
                  <p className="ni-d">{n.description}</p>
                </div>
                <span className="ni-time">{n.timeAgo}</span>
              </div>
            ))}

            {notifications.length === 0 && (
              <p style={{ padding: "16px 10px", color: "var(--text-subtle)", fontSize: "var(--fs-caption)", textAlign: "center" }}>
                No notifications
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
