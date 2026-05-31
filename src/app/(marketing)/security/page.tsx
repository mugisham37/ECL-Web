import { MarketingLayout } from "@/src/components/marketing/MarketingLayout";
import { SecurityDoc } from "@/src/components/marketing/SecurityDoc";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Trust — ECL Platform",
  description:
    "How ECL Platform keeps your loan data encrypted, isolated, and auditable. AES-256, TLS 1.3, SOC 2 in progress.",
};

export default function SecurityPage() {
  return (
    <MarketingLayout>
      <SecurityDoc />
    </MarketingLayout>
  );
}
