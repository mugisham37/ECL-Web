import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { fontVariables } from "@/lib/fonts";
import { ServiceWorkerCleanup } from "@/components/shared/ServiceWorkerCleanup";

export const metadata: Metadata = {
  title: "ECL Platform — IFRS 9 Expected Credit Loss",
  description:
    "Deterministic, auditable IFRS 9 Expected Credit Loss calculations for mid-tier banks and MFIs. Upload, compute, and reconcile in under 5 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={fontVariables}>
      <body className="min-h-full antialiased" suppressHydrationWarning>
        <ServiceWorkerCleanup />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
