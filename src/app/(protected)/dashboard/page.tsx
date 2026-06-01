import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — ECL Platform",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4" style={{ background: "var(--bg)" }}>
      <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-body)" }}>
        Dashboard — coming in Flow 4.
      </p>
      <Button asChild variant="secondary">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
