"use client";

import { useSession } from "next-auth/react";

export function useApiSession() {
  const { data: session, status } = useSession();
  return {
    token: session?.accessToken,
    tenantId: session?.user?.tenantId,
    role: session?.user?.role,
    isPlatformAdmin: session?.user?.isPlatformAdmin ?? false,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
