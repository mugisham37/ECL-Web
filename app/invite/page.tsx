import { redirect } from "next/navigation";
import { InviteForm } from "./InviteForm";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import { AuthLogo } from "@/app/components/auth/AuthLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accept invite — ECL Platform",
};

interface Props {
  searchParams: Promise<{ token?: string; org?: string; inviter?: string }>;
}

export default async function InvitePage({ searchParams }: Props) {
  const params = await searchParams;

  if (!params.token) {
    redirect("/auth/error?reason=expired");
  }

  return (
    <AuthLayout wide>
      <AuthLogo />
      <InviteForm
        token={params.token}
        orgName={params.org ?? "ECL Platform"}
        inviterName={params.inviter ?? "your administrator"}
      />
    </AuthLayout>
  );
}
