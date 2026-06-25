"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Bell, Check, AlertTriangle, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import type { Notification } from "@/lib/dashboard-types";
import { useAuthedQuery } from "@/hooks/use-authed-query";
import { useApiSession } from "@/hooks/use-api-session";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/api/settings";

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { token } = useApiSession();

  const { data: notifications = [] } = useAuthedQuery(
    ["notifications"],
    (t) => fetchNotifications(t),
    { staleTime: 30_000, refetchInterval: 60_000 },
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  async function handleMarkAllRead() {
    if (!token) return;
    await markAllNotificationsRead(token);
    refresh();
  }

  async function handleMarkRead(id: string) {
    if (!token) return;
    await markNotificationRead(token, id);
    refresh();
  }

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
              {unreadCount > 0 && (
                <button
                  style={{ background: "none", border: 0, cursor: "pointer", fontSize: "var(--fs-caption)", color: "var(--accent)" }}
                  onClick={handleMarkAllRead}
                >
                  Mark all read
                </button>
              )}
            </div>

            {notifications.map((n) => (
              <div
                key={n.id}
                className="notif-item"
                style={{ cursor: n.read ? "default" : "pointer", opacity: n.read ? 0.7 : 1 }}
                onClick={() => !n.read && handleMarkRead(n.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !n.read) handleMarkRead(n.id);
                }}
              >
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
