import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — ECL Platform",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="text-center flex flex-col items-center gap-4">
        <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-body)" }}>
          Authentication flow coming in Flow 2.
        </p>
        <Button asChild variant="secondary">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
