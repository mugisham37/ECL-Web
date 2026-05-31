"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { useDemo } from "./DemoContext";

export function CtaBanner() {
  const { openDemo } = useDemo();

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
      style={{ padding: "clamp(56px, 8vw, 104px) 0" }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 var(--gutter)" }}>
        <p
          className="text-xs uppercase tracking-widest font-medium mb-3.5"
          style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.18em" }}
        >
          Ready when you are
        </p>
        <h2
          className="font-semibold mx-auto"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem, 1.2rem + 1.6vw, 2.2rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            color: "var(--text)",
          }}
        >
          See your own portfolio&apos;s ECL
          <br />
          in a 30-minute walkthrough
        </h2>
        <p
          className="mt-4 mx-auto"
          style={{ color: "var(--text-muted)", fontSize: "var(--fs-h3)", maxWidth: "44ch" }}
        >
          No commitment. Bring your own data or use our sample portfolio.
          We&apos;ll walk you through upload to audit trail.
        </p>
        <Button size="lg" className="mt-8" onClick={openDemo}>
          Request a demo
        </Button>
      </div>
    </motion.section>
  );
}
