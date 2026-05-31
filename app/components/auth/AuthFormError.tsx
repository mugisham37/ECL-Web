"use client";

import { AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface AuthFormErrorProps {
  message?: string;
}

export function AuthFormError({ message }: AuthFormErrorProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}
          role="alert"
          aria-live="assertive"
          className="flex items-center gap-2.5 overflow-hidden"
          style={{
            background: "var(--danger-subtle)",
            color: "var(--danger)",
            borderRadius: "var(--r-sm)",
            padding: "10px 12px",
            fontSize: "var(--fs-body)",
            fontWeight: 500,
          }}
        >
          <AlertCircle className="size-4 flex-none" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
