"use client";

import { ServerCrash, X } from "lucide-react";
import { useState } from "react";
import { useBackendStatus } from "@/hooks/use-backend-status";

function offlineTitle(reason: "unreachable" | "not_ready" | "misconfigured" | null): string {
  switch (reason) {
    case "not_ready":
      return "API server not ready";
    case "misconfigured":
      return "API not configured";
    default:
      return "API server unreachable";
  }
}

function offlineMessage(reason: "unreachable" | "not_ready" | "misconfigured" | null): string {
  switch (reason) {
    case "not_ready":
      return "The API server is running but not ready to serve requests yet (for example, the database may still be starting). Data will load once it is ready.";
    case "misconfigured":
      return "This deployment is missing BACKEND_URL. Configure the backend URL in the server environment to load live data.";
    case "unreachable":
    default:
      return "The frontend is running, but the API server is not responding. Start or check the backend service to load live data. Marketing pages still work.";
  }
}

export function BackendStatusBanner() {
  const { isOnline, isChecking, offlineReason } = useBackendStatus();
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
        <p className="text-sm font-medium">{offlineTitle(offlineReason)}</p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
          {offlineMessage(offlineReason)}
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
