function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Set it in your deployment environment (see .env.example).`,
    );
  }
  return value;
}

/** Backend base URL for server-only code (Server Actions, NextAuth callbacks). */
export function getBackendUrl(): string {
  return required(process.env.BACKEND_URL, "BACKEND_URL");
}

/** Public backend base URL, safe to expose to the browser bundle. */
export function getPublicApiUrl(): string {
  if (typeof window !== "undefined") {
    // Browser uses same-origin relative paths; Next.js rewrites proxy to BACKEND_URL.
    return "";
  }
  return required(process.env.NEXT_PUBLIC_API_URL, "NEXT_PUBLIC_API_URL");
}

/**
 * Backend base URL for code that can run on either the server or the client.
 * Browser: empty string → relative `/api/v1/...` via Next.js rewrites.
 * Server: BACKEND_URL (falls back to NEXT_PUBLIC_API_URL).
 */
export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  return process.env.BACKEND_URL ?? getPublicApiUrl();
}

/** Build a full API path (`/api/v1/...`) for fetch calls. */
export function buildApiPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = getApiUrl();
  if (!base) {
    return `/api/v1${normalized}`;
  }
  return `${base.replace(/\/$/, "")}/api/v1${normalized}`;
}
