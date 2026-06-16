import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

function buildUserFromAuthData(data: {
  access_token: string;
  user: Record<string, unknown>;
}) {
  const { access_token, user } = data;
  return {
    id: user.id as string,
    email: user.email as string,
    name: user.name as string,
    accessToken: access_token,
    tenantId: (user.tenant_id ?? user.tenantId) as string,
    tenantName: (user.tenant_name ?? user.tenantName) as string,
    role: user.role as string,
    isEmailVerified: (user.is_email_verified ?? user.isEmailVerified) as boolean,
    isOnboardingComplete: (user.is_onboarding_complete ?? user.isOnboardingComplete) as boolean,
    isPlatformAdmin: (user.is_platform_admin ?? user.isPlatformAdmin ?? false) as boolean,
  };
}

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

          if (body.data?.mfa_required) {
            throw new Error(`MFA_REQUIRED:${body.data.challenge_token ?? ""}`);
          }

          return buildUserFromAuthData(body.data);
        } catch (e) {
          if (e instanceof Error && e.message.startsWith("MFA_REQUIRED:")) throw e;
          return null;
        }
      },
    }),
    Credentials({
      id: "post-registration",
      credentials: {
        preAuthData: { label: "Pre-Auth Data", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.preAuthData) return null;
        try {
          const data = JSON.parse(credentials.preAuthData as string) as {
            access_token: string;
            user: Record<string, unknown>;
          };
          return buildUserFromAuthData(data);
        } catch {
          return null;
        }
      },
    }),
    Credentials({
      id: "mfa-credentials",
      credentials: {
        challengeToken: { label: "Challenge Token", type: "text" },
        code: { label: "MFA Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.challengeToken || !credentials?.code) return null;
        try {
          const res = await fetch(`${BACKEND_URL}/api/v1/auth/mfa/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              challenge_token: credentials.challengeToken,
              code: credentials.code,
            }),
          });
          if (!res.ok) return null;
          const body = await res.json();
          return buildUserFromAuthData(body.data);
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        if (typeof (session as Record<string, unknown>).isEmailVerified === "boolean")
          token.isEmailVerified = (session as Record<string, unknown>).isEmailVerified as boolean;
        if (typeof (session as Record<string, unknown>).isOnboardingComplete === "boolean")
          token.isOnboardingComplete = (session as Record<string, unknown>).isOnboardingComplete as boolean;
      }
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
