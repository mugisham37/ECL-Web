import { LoginForm } from "./LoginForm";
import { AuthLayout } from "@/src/components/auth/AuthLayout";
import { AuthLogo } from "@/src/components/auth/AuthLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — ECL Platform",
};

export default function SignInPage() {
  return (
    <AuthLayout>
      <AuthLogo />
      <LoginForm />
    </AuthLayout>
  );
}
