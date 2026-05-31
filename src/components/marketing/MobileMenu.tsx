"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onDemo: () => void;
}

const links = [
  { label: "How it works", href: "/#how" },
  { label: "Modules", href: "/#modules" },
  { label: "Security", href: "/security" },
  { label: "Pricing", href: "/pricing" },
  { label: "Sign in", href: "/sign-in" },
];

export function MobileMenu({ isOpen, onClose, onDemo }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: [0.65, 0, 0.35, 1] }}
          className="fixed z-[110] flex flex-col gap-1"
          style={{
            top: 64,
            left: 0,
            right: 0,
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            boxShadow: "var(--shadow-pop)",
            padding: "12px var(--gutter) 20px",
          }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="px-3 py-3 rounded-md text-sm font-medium no-underline transition-colors duration-120 hover:bg-[var(--surface-sunken)]"
              style={{ color: "var(--text)" }}
            >
              {link.label}
            </Link>
          ))}
          <Button
            onClick={onDemo}
            size="default"
            className="mt-2 w-full"
          >
            Request a demo
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
