"use client";

import { useSession } from "next-auth/react";
import { useAuthedQuery } from "@/hooks/use-authed-query";
import { fetchDashboard } from "@/lib/api/dashboard";
import { mapDashboardToPageData, formatRole } from "@/lib/api/mappers";
import { DashboardView } from "./DashboardView";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { BackendUnavailableNotice } from "@/components/shared/BackendUnavailableNotice";
import type { DashboardData, Tenant, AppShellUser } from "@/lib/dashboard-types";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function buildSessionContext(session: NonNullable<ReturnType<typeof useSession>["data"]>): {
  user: AppShellUser;
  tenant: Tenant;
} {
  const user = {
    name: session.user?.name ?? "",
    email: session.user?.email ?? "",
    initials: getInitials(session.user?.name ?? "U"),
    role: formatRole(session.user?.role ?? "analyst"),
  };

  const tenant = {
    id: session.user?.tenantId ?? "",
    name: session.user?.tenantName ?? "Workspace",
    currency: "USD",
    role: formatRole(session.user?.role ?? "analyst") as
      | "Administrator"
      | "Analyst"
      | "Reviewer",
    initials: getInitials(session.user?.tenantName ?? "W").slice(0, 2),
  };

  return { user, tenant };
}

function emptyDashboard(user: AppShellUser, tenant: Tenant): DashboardData {
  return {
    state: "empty",
    tenant,
    allTenants: [tenant],
    user,
    kpis: [],
    segments: [],
    stages: [],
    trend: [],
    runs: [],
    notifications: [],
  };
}

export function DashboardLoader() {
  const { data: session, status: sessionStatus } = useSession();
  const { data, isLoading, isError, error, refetch } = useAuthedQuery(
    ["dashboard", session?.user?.tenantId],
    (token, tenantId) => fetchDashboard(token, tenantId),
    { staleTime: 30_000 },
  );

  if (sessionStatus === "loading" || isLoading || !session?.user) {
    return (
      <>
        <div className="page-head">
          <div>
            <h1>Dashboard</h1>
            <div className="ph-sub">
              <span>Loading…</span>
            </div>
          </div>
        </div>
        <LoadingSkeleton />
      </>
    );
  }

  const { user, tenant } = buildSessionContext(session);

  if (isError) {
    return (
      <>
        <div className="page-head">
          <div>
            <h1>Dashboard</h1>
          </div>
        </div>
        <div style={{ marginTop: "var(--sp-4)" }}>
          <BackendUnavailableNotice error={error} onRetry={() => void refetch()} />
        </div>
        <DashboardView initialData={emptyDashboard(user, tenant)} />
      </>
    );
  }

  if (!data) {
    return <DashboardView initialData={emptyDashboard(user, tenant)} />;
  }

  return (
    <DashboardView initialData={mapDashboardToPageData(data, tenant, user)} />
  );
}
