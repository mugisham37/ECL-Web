import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPrefixes = [
        "/dashboard",
        "/runs",
        "/results",
        "/admin",
        "/settings",
        "/platform",
        "/account",
        "/setup",
      ];

      if (nextUrl.pathname.startsWith("/platform")) {
        const isPlatformAdmin = (auth?.user as Record<string, unknown> | undefined)
          ?.isPlatformAdmin as boolean | undefined;
        if (!isPlatformAdmin) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
      }
      const isProtected = protectedPrefixes.some((p) =>
        nextUrl.pathname.startsWith(p)
      );

      if (isProtected && !isLoggedIn) return false;

      const isOnboardingComplete = (auth?.user as Record<string, unknown> | undefined)
        ?.isOnboardingComplete as boolean | undefined;
      const onOnboardingPage = nextUrl.pathname.startsWith("/setup/onboarding");

      // Not yet onboarded → force to onboarding (except if already there)
      if (isLoggedIn && isProtected && isOnboardingComplete === false && !onOnboardingPage) {
        return Response.redirect(new URL("/setup/onboarding", nextUrl));
      }

      // Already onboarded → skip the onboarding page
      if (isLoggedIn && isOnboardingComplete === true && onOnboardingPage) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
