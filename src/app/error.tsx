"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isStaleModule =
    error.message.includes("module factory is not available") ||
    error.message.includes("next-themes");

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div
        className="w-full max-w-md rounded-lg border px-6 py-5"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0" style={{ color: "var(--danger)" }} />
          <div>
            <h2 className="text-base font-semibold">Something went wrong</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              {isStaleModule
                ? "A stale browser or dev cache is serving outdated JavaScript. Hard-reload the page (Ctrl+Shift+R) or run npm run cache:reset and restart the dev server."
                : error.message}
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white"
              style={{ background: "var(--accent)" }}
              onClick={() => reset()}
            >
              <RefreshCw className="size-4" />
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
