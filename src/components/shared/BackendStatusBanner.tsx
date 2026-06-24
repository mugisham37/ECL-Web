"use client";

import { ServerCrash, X } from "lucide-react";
import { useState } from "react";
import { useBackendStatus } from "@/hooks/use-backend-status";

export function BackendStatusBanner() {
  const { isOnline, isChecking } = useBackendStatus();
  const [dismissed, setDismissed] = useState(false);

  if (isChecking || isOnline !== false || dismissed) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 z-[200] flex w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 items-start gap-3 rounded-lg border px-4 py-3 shadow-lg"
      style={{
        background: "var(--warning-subtle)",
        borderColor: "color-mix(in srgb, var(--warning) 35%, var(--border))",
        color: "var(--text)",
      }}
    >
      <ServerCrash className="mt-0.5 size-4 shrink-0" style={{ color: "var(--warning)" }} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">API server unreachable</p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
          The frontend is running, but ECL-Server is not responding. Start the backend on port
          8000 to load live data. Marketing pages still work.
        </p>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        className="rounded p-1 transition-colors hover:bg-black/5"
        onClick={() => setDismissed(true)}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
