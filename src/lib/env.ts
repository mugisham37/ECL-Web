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
  return required(process.env.NEXT_PUBLIC_API_URL, "NEXT_PUBLIC_API_URL");
}

/**
 * Backend base URL for code that can run on either the server or the client
 * (e.g. a shared fetch helper). Prefers the server-only var when available.
 */
export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    return getPublicApiUrl();
  }
  return process.env.BACKEND_URL ?? getPublicApiUrl();
}
