"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useWizard } from "./WizardContext";

interface WelcomeScreenProps {
  userName?: string;
  orgName?: string;
}

const roadmap = [
  { n: 1, title: "Tenant profile", desc: "Currency, time zone and reporting cadence", time: "~1 min" },
  { n: 2, title: "Segments", desc: "The portfolios you'll compute ECL for", time: "~2 min" },
  { n: 3, title: "Collateral & haircuts", desc: "Discount rates used by the LGD engine", time: "~3 min" },
  { n: 4, title: "Invite your team", desc: "Analysts and reviewers — optional", time: "~1 min" },
  { n: 5, title: "Review & finish", desc: "Confirm and open your workspace", time: "~1 min" },
];

export function WelcomeScreen({ userName = "Administrator", orgName = "your institution" }: WelcomeScreenProps) {
  const { dispatch } = useWizard();

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="rounded-xl"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          padding: "clamp(24px,4vw,40px)",
        }}
      >
        <p
          className="text-xs uppercase tracking-widest font-medium mb-2"
          style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}
        >
          Welcome · {userName} · Administrator
        </p>
        <h1
          className="font-semibold"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem, 1.3rem + 1.4vw, 2rem)",
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          Let&apos;s get {orgName} set up.
        </h1>
        <p className="mt-2 max-w-[54ch]" style={{ color: "var(--text-muted)", lineHeight: 1.55 }}>
          A few one-time settings before your team can run its first ECL. You can save
          and come back anytime — about 10 minutes end to end.
        </p>

        {/* Roadmap */}
        <div className="flex flex-col gap-0.5 my-7">
          {roadmap.map((item) => (
            <div
              key={item.n}
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-md"
              style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
            >
              <span
                className="size-[30px] rounded-lg flex items-center justify-center flex-none text-sm font-medium"
                style={{
                  background: "var(--accent-subtle)",
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {item.n}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm" style={{ color: "var(--text)" }}>
                  {item.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {item.desc}
                </p>
              </div>
              <span
                className="text-xs flex-none ml-auto"
                style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}
              >
                {item.time}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button
            variant="ghost"
            onClick={() => dispatch({ type: "OPEN_SKIP_MODAL" })}
          >
            Skip for now
          </Button>
          <Button
            size="lg"
            className="gap-1.5"
            onClick={() => dispatch({ type: "GO_TO_STEP", step: 0 })}
          >
            Begin setup
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
