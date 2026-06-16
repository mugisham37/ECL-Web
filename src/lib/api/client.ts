function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  }
  return (
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8000"
  );
}

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

// ── 401 refresh queue (client-side only) ──────────────────────────────────

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return null;
    const body = await res.json();
    return (body?.data?.access_token as string) ?? null;
  } catch {
    return null;
  }
}

function drainQueue(token: string | null) {
  refreshQueue.forEach((resolve) => resolve(token));
  refreshQueue = [];
}

// ── Core fetch ────────────────────────────────────────────────────────────

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string; timeoutMs?: number } = {},
): Promise<T> {
  const { token, headers: extraHeaders, timeoutMs, ...rest } = options;
  const headers: Record<string, string> = {
    ...(extraHeaders as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (rest.body && !(rest.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
  }

  const controller = timeoutMs ? new AbortController() : null;
  const timeoutId =
    controller && timeoutMs
      ? setTimeout(() => controller.abort(), timeoutMs)
      : null;

  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/api/v1${path}`, {
      ...rest,
      headers,
      credentials: "include",
      signal: controller?.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(
        "TIMEOUT",
        "The request timed out. Large files can take a while — try again.",
        408,
      );
    }
    if (err instanceof TypeError) {
      throw new ApiError(
        "NETWORK_ERROR",
        "Could not reach the API server. Check that ECL-Server is running on port 8000.",
        0,
      );
    }
    throw err;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

  // ── 401 refresh (client-side only) ──────────────────────────────────────
  if (res.status === 401 && typeof window !== "undefined") {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await refreshAccessToken();
      isRefreshing = false;
      drainQueue(newToken);

      if (!newToken) {
        const { signOut } = await import("next-auth/react");
        await signOut({ redirectTo: "/sign-in" });
        throw new ApiError("UNAUTHORIZED", "Session expired.", 401);
      }

      // Retry once with the new token
      const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
      const retryRes = await fetch(`${getApiBaseUrl()}/api/v1${path}`, {
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
    } else {
      // Another refresh is in flight — queue this request
      const newToken = await new Promise<string | null>((resolve) => {
        refreshQueue.push(resolve);
      });
      if (!newToken) {
        throw new ApiError("UNAUTHORIZED", "Session expired.", 401);
      }
      const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
      const retryRes = await fetch(`${getApiBaseUrl()}/api/v1${path}`, {
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
