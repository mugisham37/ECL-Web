import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              remember: credentials.remember === "true",
            }),
          });

          if (!res.ok) return null;

          const body = await res.json();
          const { access_token, user } = body.data;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            accessToken: access_token,
            tenantId: user.tenant_id,
            tenantName: user.tenant_name,
            role: user.role,
            isEmailVerified: user.is_email_verified,
            isOnboardingComplete: user.is_onboarding_complete,
            isPlatformAdmin: user.is_platform_admin ?? false,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as Record<string, unknown>).accessToken as string;
        token.tenantId = (user as Record<string, unknown>).tenantId as string;
        token.tenantName = (user as Record<string, unknown>).tenantName as string;
        token.role = (user as Record<string, unknown>).role as string;
        token.isEmailVerified = (user as Record<string, unknown>).isEmailVerified as boolean;
        token.isOnboardingComplete = (user as Record<string, unknown>).isOnboardingComplete as boolean;
        token.isPlatformAdmin = (user as Record<string, unknown>).isPlatformAdmin as boolean;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      if (session.user) {
        session.user.tenantId = token.tenantId as string;
        session.user.tenantName = token.tenantName as string;
        session.user.role = token.role as string;
        session.user.isEmailVerified = token.isEmailVerified as boolean;
        session.user.isOnboardingComplete = token.isOnboardingComplete as boolean;
        session.user.isPlatformAdmin = token.isPlatformAdmin as boolean;
      }
      return session;
    },
  },
});
