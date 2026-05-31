import { ForgotForm } from "./ForgotForm";
import { AuthLayout } from "@/src/components/auth/AuthLayout";
import { AuthLogo } from "@/src/components/auth/AuthLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset password — ECL Platform",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <AuthLogo />
      <ForgotForm />
    </AuthLayout>
  );
}
