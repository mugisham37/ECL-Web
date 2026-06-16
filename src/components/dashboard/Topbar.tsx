"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Plus } from "lucide-react";
import { useApiSession } from "@/hooks/use-api-session";
import { TenantMenu } from "./TenantMenu";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserMenu } from "./UserMenu";
import type { AppShellUser, Tenant, Notification } from "@/lib/dashboard-types";

interface TopbarProps {
  user: AppShellUser;
  tenant: Tenant;
  allTenants: Tenant[];
  notifications: Notification[];
  onOpenMobileDrawer: () => void;
  onToggleCollapse: () => void;
  onSwitchTenant: (t: Tenant) => void;
}

export function Topbar({
  user,
  tenant,
  allTenants,
  notifications,
  onOpenMobileDrawer,
  onToggleCollapse,
  onSwitchTenant,
}: TopbarProps) {
  const [activeTenant, setActiveTenant] = useState<Tenant>(tenant);
  const { role } = useApiSession();
  const canCreateRun = role !== "reviewer";

  function handleMenuPress() {
    if (window.innerWidth < 768) onOpenMobileDrawer();
    else onToggleCollapse();
  }

  function handleSwitch(t: Tenant) {
    setActiveTenant(t);
    onSwitchTenant(t);
  }

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--sp-4)",
        padding: "0 var(--gutter)",
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 35,
        height: "var(--topbar-h)",
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", minWidth: 0 }}>
        {/* Hamburger — all breakpoints: collapses sidebar on md+, opens drawer on mobile */}
        <button
          className="topbar-icon-btn"
          onClick={handleMenuPress}
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>

        {/* Tenant switcher */}
        <TenantMenu
          activeTenant={activeTenant}
          allTenants={allTenants}
          onSwitch={handleSwitch}
        />
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {canCreateRun && (
          <Link
            href="/runs/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              height: "var(--control-h)",
              padding: "0 14px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--r-sm)",
              fontFamily: "var(--font-ui)",
              fontSize: "var(--fs-body)",
              fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"],
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "background var(--t-micro)",
              textDecoration: "none",
            }}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Run</span>
          </Link>
        )}

        {/* Notifications */}
        <NotificationsDropdown notifications={notifications} />

        {/* User menu */}
        <UserMenu user={user} />
      </div>
    </header>
  );
}
