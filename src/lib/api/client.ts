import { buildApiPath, getApiUrl } from "@/lib/env";

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

// Keep both values under Vercel Hobby's 10s function limit so our code throws
// a clean TIMEOUT error before Vercel hard-kills the function with a 504.
export const SERVER_FETCH_TIMEOUT_MS = 8_000;
export const SERVER_FETCH_WRITE_TIMEOUT_MS = 9_000;
export const UPLOAD_TIMEOUT_MS = 300_000;

function defaultServerTimeoutMs(method?: string): number | undefined {
  if (typeof window !== "undefined") return undefined;
  if (method && method !== "GET" && method !== "HEAD") {
    return SERVER_FETCH_WRITE_TIMEOUT_MS;
  }
  return SERVER_FETCH_TIMEOUT_MS;
}

// ── 401 refresh queue (client-side only) ──────────────────────────────────

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(buildApiPath("/auth/refresh"), {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return null;
    const body = await res.json();
    const newToken = (body?.data?.access_token as string) ?? null;
    if (newToken && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("ecl:token-refreshed", { detail: { accessToken: newToken } }),
      );
    }
    return newToken;
  } catch {
    return null;
  }
}

function drainQueue(token: string | null) {
  refreshQueue.forEach((resolve) => resolve(token));
  refreshQueue = [];
}

async function resolveFreshToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  if (!isRefreshing) {
    isRefreshing = true;
    const newToken = await refreshAccessToken();
    isRefreshing = false;
    drainQueue(newToken);
    return newToken;
  }

  return new Promise<string | null>((resolve) => {
    refreshQueue.push(resolve);
  });
}

function networkError(): ApiError {
  return new ApiError(
    "NETWORK_ERROR",
    "We couldn't connect to the service. Check your internet connection and try again.",
    0,
  );
}

// ── Core fetch ────────────────────────────────────────────────────────────

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string; timeoutMs?: number } = {},
): Promise<T> {
  const { token, headers: extraHeaders, timeoutMs, ...rest } = options;
  const effectiveTimeoutMs = timeoutMs ?? defaultServerTimeoutMs(rest.method);
  const headers: Record<string, string> = {
    ...(extraHeaders as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (rest.body && !(rest.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
  }

  const controller = effectiveTimeoutMs ? new AbortController() : null;
  const timeoutId =
    controller && effectiveTimeoutMs
      ? setTimeout(() => controller.abort(), effectiveTimeoutMs)
      : null;

  let res: Response;
  try {
    res = await fetch(buildApiPath(path), {
      ...rest,
      headers,
      credentials: "include",
      signal: controller?.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(
        "TIMEOUT",
        "This is taking longer than expected. Please wait a moment and try again.",
        408,
      );
    }
    if (err instanceof TypeError) {
      throw networkError();
    }
    throw err;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

  // ── 401 refresh (client-side only) ──────────────────────────────────────
  if (res.status === 401 && typeof window !== "undefined") {
    const newToken = await resolveFreshToken();

    if (!newToken) {
      const { signOut } = await import("next-auth/react");
      await signOut({ redirectTo: "/sign-in" });
      throw new ApiError("UNAUTHORIZED", "Your session has expired. Sign in again to continue.", 401);
    }

    const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
    const retryRes = await fetch(buildApiPath(path), {
      ...rest,
      headers: retryHeaders,
      credentials: "include",
      signal: controller?.signal,
    });
    if (retryRes.status === 204) return undefined as T;
    const retryBody = await retryRes.json().catch(() => ({}));
    if (!retryRes.ok) {
      throw new ApiError(
        retryBody.code ?? "API_ERROR",
        retryBody.detail ?? "Request failed.",
        retryRes.status,
      );
    }
    if (retryBody && typeof retryBody === "object" && "data" in retryBody) {
      return (retryBody as ApiEnvelope<T>).data;
    }
    return retryBody as T;
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      body.code ?? "API_ERROR",
      body.detail ?? "Request failed.",
      res.status,
    );
  }

  if (body && typeof body === "object" && "data" in body) {
    return (body as ApiEnvelope<T>).data;
  }
  return body as T;
}

/** Check whether the backend is reachable (client-side). */
export async function checkBackendAvailable(): Promise<boolean> {
  try {
    const res = await fetch("/api/backend-status", {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) return false;
    const body = await res.json().catch(() => ({}));
    // backend-status returns { reachable: true, status: "ready" } from probeBackend
    return body?.reachable === true || body?.ok === true;
  } catch {
    return false;
  }
}
