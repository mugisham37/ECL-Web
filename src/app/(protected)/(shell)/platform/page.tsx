import type { Metadata } from "next";
import { SuperAdminView } from "@/components/superadmin/SuperAdminView";

export const metadata: Metadata = {
  title: "Platform — ECL Operator Console",
};

export default function PlatformPage() {
  return <SuperAdminView />;
}
