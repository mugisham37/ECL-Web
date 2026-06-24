"use client";

import { useEffect, useState } from "react";

const CHECK_INTERVAL_MS = 60_000;
const CHECK_TIMEOUT_MS = 3_000;

function getHealthUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  return `${base.replace(/\/$/, "")}/health`;
}

async function pingBackend(): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);

  try {
    const res = await fetch(getHealthUrl(), {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function useBackendStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const ok = await pingBackend();
      if (!cancelled) setIsOnline(ok);
    }

    void check();
    const id = window.setInterval(check, CHECK_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return { isOnline, isChecking: isOnline === null };
}
