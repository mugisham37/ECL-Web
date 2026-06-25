import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/dashboard/AppShell";
import { formatRole } from "@/lib/format-role";
import { getBackendUrl } from "@/lib/env";
import type { Tenant } from "@/lib/dashboard-types";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface MembershipRaw {
  tenant_id: string;
  tenant_name: string;
  role: string;
  status: string;
  currency?: string;
}

async function fetchMemberships(token: string): Promise<MembershipRaw[]> {
  try {
    const res = await fetch(`${getBackendUrl()}/api/v1/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const body = await res.json();
    return body.data?.memberships ?? [];
  } catch {
    return [];
  }
}

function mapMembershipToTenant(m: MembershipRaw): Tenant {
  const role = formatRole(m.role);
  return {
    id: m.tenant_id,
    name: m.tenant_name,
    currency: m.currency ?? "USD",
    role: role as Tenant["role"],
    initials: getInitials(m.tenant_name).slice(0, 2),
  };
}

export default async function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = {
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    initials: getInitials(session.user.name ?? "U"),
    role: formatRole(session.user.role ?? "analyst"),
  };

  const tenant: Tenant = {
    id: session.user.tenantId ?? "",
    name: session.user.tenantName ?? "Workspace",
    currency: session.user.currency ?? "USD",
    role: formatRole(session.user.role ?? "analyst") as Tenant["role"],
    initials: getInitials(session.user.tenantName ?? "W").slice(0, 2),
  };

  const memberships = session.accessToken
    ? await fetchMemberships(session.accessToken)
    : [];
  const activeMemberships = memberships.filter((m) => m.status === "active");
  const allTenants =
    activeMemberships.length > 0
      ? activeMemberships.map(mapMembershipToTenant)
      : [tenant];

  return (
    <AppShell
      user={user}
      tenant={tenant}
      allTenants={allTenants}
    >
      {children}
    </AppShell>
  );
}
