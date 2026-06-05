import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SuperAdminView } from "@/components/superadmin/SuperAdminView";

export const metadata: Metadata = {
  title: "Platform — ECL Operator Console",
};

export default async function PlatformPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  if (!session.user.isPlatformAdmin) redirect("/dashboard");
  return <SuperAdminView />;
}
