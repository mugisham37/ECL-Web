"use client";

import { motion } from "framer-motion";

const logos = [
  { name: "Meridian Bank", mono: true },
  { name: "Acacia MFI", mono: false },
  { name: "Rift Valley Trust", mono: true },
  { name: "Savanna Capital", mono: false },
  { name: "Lakeshore MFB", mono: true },
  { name: "Coast Credit", mono: false },
];

export function LogoStrip() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ padding: "clamp(40px, 5vw, 64px) 0" }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 var(--gutter)" }}>
        <p
          className="text-center text-xs uppercase tracking-widest mb-8"
          style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)", letterSpacing: "0.18em" }}
        >
          Designed for risk teams across East Africa
        </p>
        <div
          className="flex items-center justify-center gap-x-12 gap-y-4 flex-wrap"
          style={{ opacity: 0.6 }}
        >
          {logos.map((logo) => (
            <span
              key={logo.name}
              className="font-semibold text-xl whitespace-nowrap"
              style={{
                fontFamily: logo.mono ? "var(--font-mono)" : "var(--font-display)",
                color: "var(--text-muted)",
                letterSpacing: "-0.01em",
              }}
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
