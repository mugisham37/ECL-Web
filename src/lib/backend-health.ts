export const BACKEND_PROBE_TIMEOUT_MS = 2_500;
export const BACKEND_PROBE_PATH = "/ready";

export type BackendProbeResult =
  | { reachable: true; status: "ready" }
  | { reachable: false; reason: "unreachable" | "not_ready" | "misconfigured" };

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

/**
 * Server-side probe: is the FastAPI process up and able to serve requests?
 * Uses /ready (DB ping) — fast and distinct from the heavy /health diagnostics.
 */
export async function probeBackend(
  backendUrl: string | undefined,
  timeoutMs = BACKEND_PROBE_TIMEOUT_MS,
): Promise<BackendProbeResult> {
  if (!backendUrl?.trim()) {
    return { reachable: false, reason: "misconfigured" };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${normalizeBaseUrl(backendUrl)}${BACKEND_PROBE_PATH}`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      return { reachable: true, status: "ready" };
    }

    return { reachable: false, reason: "not_ready" };
  } catch {
    return { reachable: false, reason: "unreachable" };
  } finally {
    clearTimeout(timeoutId);
  }
}
