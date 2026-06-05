import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { fetchDashboard } from "@/lib/api/dashboard";
import { mapDashboardToPageData, formatRole } from "@/lib/api/mappers";
import type { DashboardData } from "@/lib/dashboard-types";

export const metadata: Metadata = {
  title: "Dashboard — ECL Platform",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const user = {
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    initials: getInitials(session.user.name ?? "U"),
    role: formatRole(session.user.role ?? "analyst"),
  };

  const tenant = {
    id: session.user.tenantId ?? "",
    name: session.user.tenantName ?? "Workspace",
    currency: "USD",
    role: formatRole(session.user.role ?? "analyst") as
      | "Administrator"
      | "Analyst"
      | "Reviewer",
    initials: getInitials(session.user.tenantName ?? "W").slice(0, 2),
  };

  try {
    const raw = await fetchDashboard(session.accessToken, session.user.tenantId);
    const data = mapDashboardToPageData(raw, tenant, user);
    return <DashboardView initialData={data} />;
  } catch {
    const fallback: DashboardData = {
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
    return <DashboardView initialData={fallback} />;
  }
}
