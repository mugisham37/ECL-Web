"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/src/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  shake?: boolean;
  className?: string;
}

export function AuthCard({ children, shake = false, className }: AuthCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shake || !ref.current) return;
    const el = ref.current;
    el.style.animation = "none";
    void el.offsetWidth; // force reflow
    el.style.animation = "auth-shake 300ms var(--ease-inout)";
    const timer = setTimeout(() => {
      if (el) el.style.animation = "";
    }, 320);
    return () => clearTimeout(timer);
  }, [shake]);

  return (
    <div
      ref={ref}
      className={cn("w-full", className)}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)",
        padding: "32px",
        boxShadow: "var(--shadow-pop)",
        animation: "auth-in 240ms var(--ease-out)",
      }}
    >
      {children}
    </div>
  );
}
