"use client";

import { motion } from "framer-motion";
import { ThemeToggle } from "@/app/components/marketing/ThemeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
  wide?: boolean;
}

const nodes = [
  { top: "15%", left: "8%" },
  { top: "70%", left: "6%" },
  { top: "20%", left: "91%" },
  { top: "75%", left: "89%" },
];

export function AuthLayout({ children, wide = false }: AuthLayoutProps) {
  return (
    <div
      className="relative min-h-screen grid place-items-center overflow-hidden"
      style={{ background: "var(--bg)", padding: "48px 16px" }}
    >
      {/* Blueprint grid background — calmer than the hero */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 42%, #000 35%, transparent 82%)",
        }}
      />

      {/* Decorative cyan nodes */}
      {nodes.map((pos, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            top: pos.top,
            left: pos.left,
            width: 5,
            height: 5,
            borderRadius: 1,
            background: "var(--grid-node)",
          }}
        />
      ))}

      {/* Theme toggle — top right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Content column */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full flex flex-col items-center gap-6"
        style={{ maxWidth: wide ? 480 : 400 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
