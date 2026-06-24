"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import type { ApiError } from "@/lib/api/client";

interface BackendUnavailableNoticeProps {
  title?: string;
  error?: ApiError | null;
  onRetry?: () => void;
}

export function BackendUnavailableNotice({
  title = "Could not load data",
  error,
  onRetry,
}: BackendUnavailableNoticeProps) {
  const isNetwork =
    error?.code === "NETWORK_ERROR" || error?.code === "TIMEOUT" || error?.status === 0;

  return (
    <div
      className="rounded-lg border px-4 py-3"
      style={{
        background: "var(--warning-subtle)",
        borderColor: "color-mix(in srgb, var(--warning) 30%, var(--border))",
      }}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-4 shrink-0" style={{ color: "var(--warning)" }} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            {isNetwork
              ? "The service is temporarily unavailable. Check your connection and try again."
              : (error?.message ?? "The request failed. Try again in a moment.")}
          </p>
          {onRetry && (
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium"
              style={{ color: "var(--accent)" }}
              onClick={onRetry}
            >
              <RefreshCw className="size-3" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
