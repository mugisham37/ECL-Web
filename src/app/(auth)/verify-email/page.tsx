import { VerifyEmailHandler } from "@/components/auth/VerifyEmailHandler";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthLogo } from "@/components/auth/AuthLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify email — ECL Platform",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  return (
    <AuthLayout>
      <AuthLogo />
      <VerifyEmailHandler token={token} />
    </AuthLayout>
  );
}
