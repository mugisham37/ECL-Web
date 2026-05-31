"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

const modules = [
  {
    tag: "PD ENGINE",
    title: "Probability of Default",
    desc: "Cohort-based and individual PD curves with vintage analysis. Supports through-the-cycle and point-in-time adjustments.",
    features: [
      "Stage 1/2/3 classification logic",
      "Significant increase in credit risk (SICR) thresholds",
      "Forward-looking macro overlay (Phase 2)",
      "Vintage curve fitting",
    ],
  },
  {
    tag: "LGD ENGINE",
    title: "Loss Given Default",
    desc: "Collateral-aware LGD with recovery waterfall modelling. Handles secured, unsecured, and mixed portfolios.",
    features: [
      "Collateral type registry",
      "Haircut & forced-sale discount tables",
      "Recovery rate curves by segment",
      "Historical backtesting view",
    ],
  },
  {
    tag: "EAD ENGINE",
    title: "Exposure at Default & Staging",
    desc: "EAD computation with credit conversion factors for off-balance sheet items. Full IFRS 9 three-stage classification.",
    features: [
      "CCF for undrawn commitments",
      "Stage 1 / 2 / 3 / Off-books labels",
      "Loan-level EAD decomposition",
      "Export to regulatory templates",
    ],
  },
];

export function ModulesSection() {
  return (
    <section
      id="modules"
      style={{
        padding: "clamp(56px, 8vw, 104px) 0",
        background: "var(--surface-sunken)",
      }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 var(--gutter)" }}>
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p
            className="text-xs uppercase tracking-widest font-medium mb-3.5 mx-auto"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.18em" }}
          >
            The Engine
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
            Three modules. One deterministic result.
          </h2>
          <p
            className="mt-3 mx-auto max-w-[52ch]"
            style={{ color: "var(--text-muted)", fontSize: "var(--fs-h3)" }}
          >
            Each module runs independently and combines into a single auditable ECL figure.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid gap-4 modules-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {modules.map((mod, i) => (
            <motion.div
              key={mod.tag}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-7 rounded-md flex flex-col gap-3 transition-all duration-180 group"
              style={{ border: "1px solid var(--border)", background: "var(--surface)", cursor: "default" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-hover)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              }}
            >
              <span
                className="text-[11px] uppercase tracking-widest"
                style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}
              >
                {mod.tag}
              </span>

              <h3
                className="font-semibold"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--fs-h2)",
                  color: "var(--text)",
                }}
              >
                {mod.title}
              </h3>

              <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-body)", lineHeight: 1.6 }}>
                {mod.desc}
              </p>

              {/* Feature list */}
              <ul className="flex flex-col gap-2.5 mt-1">
                {mod.features.map((f) => (
                  <li key={f} className="flex gap-2.5 items-start text-sm">
                    <Check
                      className="size-3.5 mt-0.5 flex-none"
                      style={{ color: "var(--accent)" }}
                    />
                    <span style={{ color: "var(--text-muted)" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .modules-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
