import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        // TODO: replace with real API call to verify credentials
        // Stub: accept any well-formed email + non-empty password in development
        return {
          id: "stub-user-1",
          email: String(credentials.email),
          name: "Demo User",
        };
      },
    }),
  ],
});
