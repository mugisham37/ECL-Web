"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

/**
 * Listens for "ecl:token-refreshed" events dispatched by the HTTP client after a
 * successful token refresh and propagates the new access token into the NextAuth
 * session. Without this, the NextAuth JWT still holds the old expired token and
 * every subsequent API call receives a 401, triggering an infinite refresh loop.
 */
export function TokenSyncProvider({ children }: { children: React.ReactNode }) {
  const { update } = useSession();

  useEffect(() => {
    function handleTokenRefreshed(e: Event) {
      const { accessToken } = (e as CustomEvent<{ accessToken: string }>).detail;
      if (accessToken) {
        void update({ accessToken });
      }
    }

    window.addEventListener("ecl:token-refreshed", handleTokenRefreshed);
    return () => window.removeEventListener("ecl:token-refreshed", handleTokenRefreshed);
  }, [update]);

  return <>{children}</>;
}
