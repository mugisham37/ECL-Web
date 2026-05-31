"use client";

import { Check } from "lucide-react";
import { scorePassword } from "@/src/lib/use-password-strength";

interface PasswordStrengthProps {
  password: string;
  forbidden?: string[];
  showRules?: boolean;
}

const RULES = [
  { key: "len8" as const, label: "At least 8 characters" },
  { key: "mix" as const, label: "A mix of letters and numbers" },
  { key: "name" as const, label: "Not your name or email" },
  { key: "len12" as const, label: "12+ characters (recommended)" },
];

const segColor = (score: number, segIndex: number): string => {
  if (score === 0 || segIndex >= score) return "transparent";
  if (score <= 2) return "var(--danger)";
  if (score === 3) return "var(--warning)";
  return "var(--success)";
};

export function PasswordStrength({
  password,
  forbidden = [],
  showRules = false,
}: PasswordStrengthProps) {
  const { score, label, labelClass, rules } = scorePassword(password, forbidden);

  const labelColor =
    labelClass === "weak"
      ? "var(--danger)"
      : labelClass === "fair"
      ? "var(--warning)"
      : labelClass === "strong"
      ? "var(--success)"
      : "transparent";

  return (
    <div className="flex flex-col gap-1.5 mt-1">
      {/* 5-segment meter */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className="flex-1 h-1 rounded-full transition-colors duration-180"
            style={{
              background: segColor(score, i),
              border: score === 0 || i >= score ? "1px solid var(--border)" : "1px solid transparent",
            }}
          />
        ))}
      </div>

      {/* Label */}
      <p
        className="text-xs font-medium"
        style={{
          fontFamily: "var(--font-mono)",
          color: labelColor,
          minHeight: "1em",
        }}
      >
        {label}
      </p>

      {/* Rules list */}
      {showRules && (
        <ul className="flex flex-col gap-1.5 mt-1">
          {RULES.map((rule) => {
            const met = rules[rule.key];
            return (
              <li
                key={rule.key}
                className="flex items-center gap-2 text-xs transition-colors duration-120"
                style={{ color: met ? "var(--text-muted)" : "var(--text-subtle)" }}
              >
                <span
                  className="size-[15px] rounded-full flex items-center justify-center flex-none transition-all duration-120"
                  style={{
                    border: met ? "none" : "1.5px solid var(--border-strong)",
                    background: met ? "var(--success)" : "transparent",
                  }}
                >
                  <Check
                    className="size-[9px]"
                    style={{ color: "#fff", opacity: met ? 1 : 0 }}
                  />
                </span>
                {rule.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
