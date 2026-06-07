import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-full antialiased">
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
