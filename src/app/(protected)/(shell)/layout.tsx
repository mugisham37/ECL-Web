import { AppShell } from "@/components/dashboard/AppShell";
import { getMockDashboardData } from "@/lib/dashboard-mock";

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
  // Session is already verified by the parent (protected)/layout.tsx
  // Use mock data for shell chrome until backend is wired
  const mock = getMockDashboardData("healthy");

  const user = {
    name: mock.user.name,
    email: mock.user.email,
    initials: getInitials(mock.user.name),
    role: mock.user.role,
  };

  return (
    <AppShell
      user={user}
      tenant={mock.tenant}
      allTenants={mock.allTenants}
      notifications={mock.notifications}
    >
      {children}
    </AppShell>
  );
}
