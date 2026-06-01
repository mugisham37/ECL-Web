import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { getMockDashboardData } from "@/lib/dashboard-mock";

export const metadata: Metadata = {
  title: "Dashboard — ECL Platform",
};

export default function DashboardPage() {
  // In production this will be: const data = await getDashboardData(session.tenantId)
  const data = getMockDashboardData("healthy");

  return <DashboardView initialData={data} />;
}
