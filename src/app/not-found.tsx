import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default function NotFound() {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-4 px-6"
      style={{ background: "var(--bg)" }}
    >
      <p
        className="font-semibold select-none"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(5rem, 14vw, 9rem)",
          lineHeight: 1,
          color: "var(--surface-sunken)",
          WebkitTextStroke: "1px var(--border-strong)",
        }}
      >
        404
      </p>
      <h1
        className="font-semibold"
        style={{ fontSize: "var(--fs-h1)", color: "var(--text)" }}
      >
        Page not found
      </h1>
      <p style={{ color: "var(--text-muted)", maxWidth: "36ch" }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild size="lg" className="mt-2">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
