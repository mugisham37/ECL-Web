"use client";

import { useCallback, useEffect, useState } from "react";
import type { BackendProbeResult } from "@/lib/backend-health";

const CHECK_INTERVAL_MS = 30_000;
const PROBE_TIMEOUT_MS = 6_000;
const RETRY_COUNT = 3;
const RETRY_DELAY_MS = 400;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function fetchBackendStatus(): Promise<BackendProbeResult> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

  try {
    const res = await fetch("/api/backend-status", {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      return { reachable: false, reason: "unreachable" };
    }

    return (await res.json()) as BackendProbeResult;
  } catch {
    return { reachable: false, reason: "unreachable" };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function probeWithRetries(): Promise<BackendProbeResult> {
  let last: BackendProbeResult = { reachable: false, reason: "unreachable" };

  for (let attempt = 0; attempt < RETRY_COUNT; attempt++) {
    last = await fetchBackendStatus();
    if (last.reachable) return last;
    if (attempt < RETRY_COUNT - 1) await sleep(RETRY_DELAY_MS);
  }

  return last;
}

export function useBackendStatus() {
  const [status, setStatus] = useState<BackendProbeResult | null>(null);

  const check = useCallback(async () => {
    const result = await probeWithRetries();
    setStatus(result);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const result = await probeWithRetries();
      if (!cancelled) setStatus(result);
    }

    void run();
    const id = window.setInterval(() => {
      void run();
    }, CHECK_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return {
    isOnline: status === null ? null : status.reachable,
    isChecking: status === null,
    offlineReason: status && !status.reachable ? status.reason : null,
    recheck: check,
  };
}
