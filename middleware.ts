import NextAuth from "next-auth";
import { authConfig } from "./src/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/runs/:path*",
    "/results/:path*",
    "/admin/:path*",
    "/settings/:path*",
    "/platform/:path*",
    "/setup/:path*",
  ],
};
