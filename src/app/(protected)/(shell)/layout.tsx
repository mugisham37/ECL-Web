import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/dashboard/AppShell";
import { formatRole } from "@/lib/api/mappers";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
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

  const tenant = {
    id: session.user.tenantId ?? "",
    name: session.user.tenantName ?? "Workspace",
    currency: "USD",
    role: formatRole(session.user.role ?? "analyst") as "Administrator" | "Analyst" | "Reviewer",
    initials: getInitials(session.user.tenantName ?? "W").slice(0, 2),
  };

  return (
    <AppShell
      user={user}
      tenant={tenant}
      allTenants={[tenant]}
      notifications={[]}
    >
      {children}
    </AppShell>
  );
}
