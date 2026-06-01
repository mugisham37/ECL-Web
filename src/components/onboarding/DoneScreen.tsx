"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import { useWizard } from "./WizardContext";

export function DoneScreen() {
  const router = useRouter();
  const { state } = useWizard();
  const { profile, invites, doneVariant } = state;

  const orgName = profile.institutionName || "Your workspace";
  const isSaved = doneVariant === "saved";

  const title = isSaved ? "Saved — pick up later." : `${orgName} is ready.`;
  const body = isSaved
    ? "Your progress is saved. You can finish setup anytime from your dashboard."
    : invites.length > 0
    ? `Your workspace is set up. We've emailed ${invites.length} invite${invites.length !== 1 ? "s" : ""} to your team.`
    : "Your workspace is set up and ready for its first run.";

  useEffect(() => {
    const t = setTimeout(() => router.push("/dashboard"), 2000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <motion.div
      key="done"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="rounded-xl text-center"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          padding: "clamp(40px,7vw,72px) 24px",
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="size-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "var(--success-subtle)", color: "var(--success)" }}
        >
          <CheckCircle className="size-7" />
        </motion.div>

        <h1
          className="font-semibold"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem, 1.3rem + 1.4vw, 2rem)",
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          {title}
        </h1>

        <p
          className="mt-3 mx-auto max-w-[46ch]"
          style={{ color: "var(--text-muted)", lineHeight: 1.55 }}
        >
          {body}
        </p>

        <div className="flex items-center gap-2 justify-center mt-7" style={{ color: "var(--text-muted)" }}>
          <Spinner size="sm" />
          <span className="text-sm">Opening your dashboard…</span>
        </div>
      </div>
    </motion.div>
  );
}
