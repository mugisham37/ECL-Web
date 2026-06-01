import type { Metadata } from "next";
import { Hanken_Grotesk, Spectral, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${hankenGrotesk.variable} ${spectral.variable} ${geistMono.variable} min-h-full antialiased`}
        style={
          {
            "--font-ui": `var(--font-hanken), system-ui, -apple-system, "Segoe UI", sans-serif`,
            "--font-display": `var(--font-spectral), Georgia, "Times New Roman", serif`,
            "--font-mono": `var(--font-geist-mono), "JetBrains Mono", ui-monospace, monospace`,
          } as React.CSSProperties
        }
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
