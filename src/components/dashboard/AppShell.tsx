"use client";

import { useEffect } from "react";
import { DashboardProvider } from "./DashboardContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileDrawer } from "./MobileDrawer";
import { BottomNav } from "./BottomNav";
import { useDashboard } from "./DashboardContext";
import type { AppShellUser, Tenant, Notification } from "@/lib/dashboard-types";

// ── Inner shell (needs context) ────────────────────────────────────────────

interface ShellInnerProps {
  user: AppShellUser;
  tenant: Tenant;
  allTenants: Tenant[];
  notifications: Notification[];
  children: React.ReactNode;
}

function ShellInner({
  user,
  tenant,
  allTenants,
  notifications,
  children,
}: ShellInnerProps) {
  const { state, dispatch } = useDashboard();
  const { isCollapsed, isMobileDrawerOpen } = state;

  // Auto-collapse sidebar on tablet
  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      if (w < 1024 && w >= 768) {
        dispatch({ type: "SET_COLLAPSED", value: true });
      } else if (w >= 1024) {
        dispatch({ type: "SET_COLLAPSED", value: false });
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const sidebarWidth = isCollapsed ? "var(--side-w-collapsed)" : "var(--side-w)";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: `${sidebarWidth} 1fr`,
        gridTemplateRows: "var(--topbar-h) 1fr",
        gridTemplateAreas: '"side top" "side main"',
        background: "var(--bg)",
        transition: "grid-template-columns var(--t-base) var(--ease-out)",
      }}
      className="max-md:grid-cols-[1fr]"
    >
      {/* Sidebar (hidden on mobile — MobileDrawer handles it there) */}
      <div className="hidden md:block" style={{ gridArea: "side" }}>
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => dispatch({ type: "TOGGLE_COLLAPSE" })}
        />
      </div>

      {/* Topbar */}
      <div style={{ gridArea: "top" }}>
        <Topbar
          user={user}
          tenant={tenant}
          allTenants={allTenants}
          notifications={notifications}
          onOpenMobileDrawer={() => dispatch({ type: "OPEN_MOBILE_DRAWER" })}
          onSwitchTenant={(t) => dispatch({ type: "SET_TENANT", tenant: t })}
        />
      </div>

      {/* Main content */}
      <main
        style={{ gridArea: "main", overflowX: "hidden", position: "relative" }}
        className="pb-[var(--bottom-nav-h)] md:pb-0"
      >
        {/* Blueprint grid motif */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 220,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "linear-gradient(#000, transparent)",
            WebkitMaskImage: "linear-gradient(#000, transparent)",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1180,
            margin: "0 auto",
            padding: "var(--sp-6) var(--gutter) var(--sp-16)",
          }}
        >
          {children}
        </div>
      </main>

      {/* Mobile: slide-in drawer */}
      <MobileDrawer
        open={isMobileDrawerOpen}
        onClose={() => dispatch({ type: "CLOSE_MOBILE_DRAWER" })}
      />

      {/* Mobile: bottom nav */}
      <BottomNav />
    </div>
  );
}

// ── Public shell (mounts provider) ────────────────────────────────────────

interface AppShellProps {
  user: AppShellUser;
  tenant: Tenant;
  allTenants: Tenant[];
  notifications: Notification[];
  children: React.ReactNode;
}

export function AppShell({
  user,
  tenant,
  allTenants,
  notifications,
  children,
}: AppShellProps) {
  return (
    <DashboardProvider defaultTenant={tenant}>
      <ShellInner
        user={user}
        tenant={tenant}
        allTenants={allTenants}
        notifications={notifications}
      >
        {children}
      </ShellInner>
    </DashboardProvider>
  );
}
