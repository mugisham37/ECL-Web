import type { Metadata } from "next";
import { AdminView } from "@/components/admin/AdminView";

export const metadata: Metadata = {
  title: "Admin — ECL Platform",
};

export default function AdminPage() {
  return <AdminView />;
}
