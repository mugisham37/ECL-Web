"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  Activity,
  BarChart3,
  Shield,
  Settings,
  Terminal,
} from "lucide-react";
import { useApiSession } from "@/hooks/use-api-session";
import { cn } from "@/lib/utils";

const PRIMARY_NAV = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/runs", icon: Activity, label: "Runs" },
  { href: "/results", icon: BarChart3, label: "Results" },
];

const MANAGE_NAV = [
  { href: "/admin",    icon: Shield,    label: "Admin"    },
  { href: "/settings", icon: Settings,  label: "Settings" },
  { href: "/platform", icon: Terminal,  label: "Platform" },
];

interface SidebarNavProps {
  isCollapsed?: boolean;
  onLinkClick?: () => void;
}

export function SidebarNav({ isCollapsed = false, onLinkClick }: SidebarNavProps) {
  const pathname = usePathname();
  const { isPlatformAdmin } = useApiSession();
  const manageNav = MANAGE_NAV.filter((item) => {
    if (item.href === "/platform") return isPlatformAdmin;
    return true;
  });

  function NavLink({
    href,
    icon: Icon,
    label,
    badge,
  }: {
    href: string;
    icon: React.ElementType;
    label: string;
    badge?: number;
  }) {
    const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

    return (
      <Link
        href={href}
        onClick={onLinkClick}
        className={cn("side-link", isActive && "active")}
        aria-current={isActive ? "page" : undefined}
        title={isCollapsed ? label : undefined}
      >
        {/* Active left stripe */}
        {isActive && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              top: 8,
              bottom: 8,
              width: 2,
              background: "var(--accent)",
              borderRadius: 2,
            }}
          />
        )}

        <Icon size={16} style={{ flexShrink: 0 }} />

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              style={{ overflow: "hidden", whiteSpace: "nowrap" }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>

        {!isCollapsed && badge !== undefined && (
          <span
            className="side-badge"
            style={{
              background: "var(--accent-subtle)",
              color: "var(--accent)",
              borderRadius: "var(--r-full)",
              fontSize: "var(--fs-micro)",
              fontFamily: "var(--font-mono)",
              fontWeight: "var(--fw-semibold)",
              padding: "1px 6px",
              minWidth: 18,
              textAlign: "center",
            }}
          >
            {badge}
          </span>
        )}
      </Link>
    );
  }

  return (
    <nav
      className="flex flex-col gap-0.5 mt-1"
      aria-label="Primary navigation"
    >
      {PRIMARY_NAV.map((item) => (
        <NavLink key={item.href} {...item} />
      ))}

      {/* Section label */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                fontSize: "var(--fs-micro)",
                color: "var(--text-subtle)",
                padding: "14px 10px 4px",
                letterSpacing: "var(--tracking-caps)",
                textTransform: "uppercase",
                fontFamily: "var(--font-mono)",
              }}
            >
              Manage
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {manageNav.map((item) => (
        <NavLink key={item.href} {...item} />
      ))}
    </nav>
  );
}
