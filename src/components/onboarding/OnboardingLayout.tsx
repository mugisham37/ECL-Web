"use client";

import { motion } from "framer-motion";
import { Grid3X3, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/marketing/ThemeToggle";
import { useWizard } from "./WizardContext";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  wide?: boolean;
}

export function OnboardingLayout({ children, wide = false }: OnboardingLayoutProps) {
  const { dispatch } = useWizard();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* Sticky topbar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between h-14"
        style={{
          padding: "0 var(--gutter)",
          background: "color-mix(in srgb, var(--bg) 90%, transparent)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-sm no-underline"
          style={{ color: "var(--text)" }}
        >
          <span
            className="size-[26px] rounded-[7px] flex items-center justify-center"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            <Grid3X3 className="size-3.5" />
          </span>
          <span>ECL Platform</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: "OPEN_SKIP_MODAL" })}
            className="gap-1.5"
          >
            <Clock className="size-3.5" />
            Save and exit
          </Button>
        </div>
      </header>

      {/* Body */}
      <div
        className="flex-1 flex flex-col items-center relative overflow-hidden"
        style={{ padding: "clamp(32px,5vw,56px) var(--gutter) 96px" }}
      >
        {/* Blueprint grid background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, #000 20%, transparent 70%)",
          }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 w-full"
          style={{ maxWidth: wide ? 820 : 720 }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
