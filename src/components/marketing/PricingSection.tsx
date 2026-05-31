"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { useDemo } from "./DemoContext";

const tiers = [
  {
    name: "Starter",
    price: "$1,200",
    per: "/mo",
    who: "Perfect for a single-portfolio institution getting started with IFRS 9.",
    featured: false,
    cta: "Request a demo",
    features: [
      "1 active workspace",
      "Up to 5,000 loans per run",
      "PD + LGD + EAD engine",
      "Audit trail (7 yr retention)",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "$3,500",
    per: "/mo",
    who: "For banks running multiple portfolios or reporting to multiple regulators.",
    featured: true,
    badge: "Recommended",
    cta: "Request a demo",
    features: [
      "3 active workspaces",
      "Unlimited loans per run",
      "PD + LGD + EAD engine",
      "Full results explorer + drill-down",
      "CSV / PDF export templates",
      "Role-based access (Analyst / Reviewer / Admin)",
      "Priority support + onboarding call",
      "Dedicated Slack channel",
    ],
  },
  {
    name: "Enterprise",
    price: "Contact us",
    per: "",
    who: "For large banks, groups, or institutions with custom compliance requirements.",
    featured: false,
    cta: "Talk to sales",
    features: [
      "Unlimited workspaces",
      "Custom data residency options",
      "SSO / SAML integration",
      "SOC 2 report on request",
      "Penetration test summary",
      "Custom SLA",
    ],
  },
];

export function PricingSection() {
  const { openDemo } = useDemo();

  return (
    <section style={{ padding: "clamp(56px, 8vw, 104px) 0" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 var(--gutter)" }}>
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p
            className="text-xs uppercase tracking-widest font-medium mb-3.5"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.18em" }}
          >
            Pricing
          </p>
          <h1
            className="font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 1.2rem + 1.6vw, 2.2rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.12,
              color: "var(--text)",
            }}
          >
            Simple, transparent pricing
          </h1>
          <p
            className="mt-3 mx-auto max-w-[48ch]"
            style={{ color: "var(--text-muted)", fontSize: "var(--fs-h3)" }}
          >
            No hidden fees. No per-seat surprises. Just straightforward monthly
            pricing tied to your institution size.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div
          className="grid gap-4 price-grid items-start"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col gap-4 rounded-xl p-7 transition-all duration-180"
              style={{
                border: tier.featured
                  ? "3px solid var(--accent)"
                  : "1px solid var(--border)",
                borderTopWidth: tier.featured ? 3 : 1,
                background: "var(--surface)",
              }}
              onMouseEnter={(e) => {
                if (!tier.featured) {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-hover)";
                }
              }}
              onMouseLeave={(e) => {
                if (!tier.featured) {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }
              }}
            >
              {/* Tier header */}
              <div className="flex items-center justify-between">
                <h2 className="font-semibold" style={{ fontSize: "var(--fs-h2)", color: "var(--text)" }}>
                  {tier.name}
                </h2>
                {tier.badge && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
                  >
                    {tier.badge}
                  </span>
                )}
              </div>

              {/* Price */}
              <div>
                <span
                  className="font-semibold"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2.2rem",
                    letterSpacing: "-0.02em",
                    color: "var(--text)",
                  }}
                >
                  {tier.price}
                </span>
                {tier.per && (
                  <span style={{ color: "var(--text-muted)", fontSize: "var(--fs-body)" }}>
                    {tier.per}
                  </span>
                )}
              </div>

              {/* Who */}
              <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-body)", minHeight: 40 }}>
                {tier.who}
              </p>

              {/* CTA */}
              <Button
                size="lg"
                variant={tier.featured ? "default" : "secondary"}
                className="w-full"
                onClick={openDemo}
              >
                {tier.cta}
              </Button>

              {/* Features */}
              <ul
                className="flex flex-col gap-3 pt-4"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                {tier.features.map((f) => (
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
          .price-grid {
            grid-template-columns: 1fr !important;
            max-width: 460px;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </section>
  );
}
