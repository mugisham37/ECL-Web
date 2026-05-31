"use client";

import { Hash, Users, Lock, Clock } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  {
    icon: Hash,
    title: "Deterministic hashing",
    desc: "Every run produces a cryptographic hash. Two identical inputs always produce the same output — verifiable by your auditor.",
  },
  {
    icon: Users,
    title: "Multi-user isolation",
    desc: "Each analyst works in their own environment. No cross-tenant data leakage. Role-based access across Analyst, Reviewer, and Admin.",
  },
  {
    icon: Lock,
    title: "Encrypted at rest & in transit",
    desc: "AES-256 at rest, TLS 1.3 in transit. Your loan book never leaves your workspace without your explicit export action.",
  },
  {
    icon: Clock,
    title: "7-year audit trail",
    desc: "Immutable run records stored for the IFRS 9 required retention period. Exportable to PDF or CSV for regulators.",
  },
];

export function TrustStrip() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{ padding: "clamp(56px, 8vw, 104px) 0" }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 var(--gutter)" }}>
        <div className="grid gap-6 trust-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex flex-col gap-2">
                <div
                  className="size-9 rounded-md flex items-center justify-center"
                  style={{ background: "var(--surface-sunken)", color: "var(--text-muted)" }}
                >
                  <Icon className="size-4" />
                </div>
                <h4
                  className="font-semibold"
                  style={{ fontSize: "var(--fs-h3)", color: "var(--text)" }}
                >
                  {item.title}
                </h4>
                <p style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .trust-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .trust-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.section>
  );
}
