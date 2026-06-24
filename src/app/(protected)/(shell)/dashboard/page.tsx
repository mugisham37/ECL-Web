import type { Metadata } from "next";
import { DashboardLoader } from "@/components/dashboard/DashboardLoader";

export const metadata: Metadata = {
  title: "Dashboard — ECL Platform",
};

export default function DashboardPage() {
  return <DashboardLoader />;
}
