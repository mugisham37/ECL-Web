"use client";

import { Upload, Cpu, FileCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    tag: "UPLOAD",
    icon: Upload,
    title: "Upload your loan schedule",
    desc: "Drop in a standard Excel or CSV with your loan book — PD input, LGD assumptions, and EAD exposures. Templates provided.",
  },
  {
    num: "02",
    tag: "COMPUTE",
    icon: Cpu,
    title: "Engine runs in seconds",
    desc: "The deterministic ECL engine applies IFRS 9 stage classification, applies your PD curves, LGD estimates, and EAD factors — no black boxes.",
  },
  {
    num: "03",
    tag: "RECONCILE",
    icon: FileCheck,
    title: "Export the audit trail",
    desc: "Every run produces an immutable, hashed record with full loan-level decomposition. Share with auditors or regulators instantly.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      style={{ padding: "clamp(56px, 8vw, 104px) 0" }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 var(--gutter)" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p
            className="text-xs uppercase tracking-widest font-medium mb-3.5"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.18em" }}
          >
            How it works
          </p>
          <h2
            className="font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 1.2rem + 1.6vw, 2.2rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.12,
              color: "var(--text)",
            }}
          >
            From file upload to audit trail
            <br />
            in three steps
          </h2>
        </motion.div>

        {/* Steps grid */}
        <div
          className="grid mt-10 gap-6 relative steps-grid"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-7 rounded-md"
                style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
              >
                <span
                  className="text-[11px] uppercase tracking-widest font-medium"
                  style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
                >
                  {step.num}/{step.tag}
                </span>

                <div
                  className="size-10 rounded-md flex items-center justify-center mt-4 mb-3.5"
                  style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
                >
                  <Icon className="size-5" />
                </div>

                <h3
                  className="font-semibold mb-2"
                  style={{ fontSize: "var(--fs-h3)", color: "var(--text)" }}
                >
                  {step.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-body)", lineHeight: 1.6 }}>
                  {step.desc}
                </p>

                {/* Arrow connector between cards */}
                {i < steps.length - 1 && (
                  <span
                    className="absolute top-1/2 -translate-y-1/2 -right-4 hidden md:block"
                    style={{ color: "var(--text-subtle)" }}
                    aria-hidden="true"
                  >
                    <ArrowRight className="size-5" />
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
