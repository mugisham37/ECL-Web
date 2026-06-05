import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminView } from "@/components/admin/AdminView";
import { formatRole } from "@/lib/api/mappers";

export const metadata: Metadata = {
  title: "Admin — ECL Platform",
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  const role = formatRole(session.user.role ?? "analyst");
  return <AdminView userRole={role} />;
}
