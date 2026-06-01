"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ResultKpiCardProps {
  label: string;
  value: string;
  currencyPrefix?: string;
  copyable?: boolean;
}

export function ResultKpiCard({ label, value, currencyPrefix, copyable }: ResultKpiCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="rk">
      <div className="k">{label}</div>
      <div className="v">
        {currencyPrefix && <span className="cur">{currencyPrefix}</span>}
        {value}
        {copyable && (
          <button
            onClick={handleCopy}
            aria-label="Copy"
            style={{
              marginLeft: 6, background: "none", border: 0, cursor: "pointer",
              color: copied ? "var(--success)" : "var(--text-muted)",
              display: "inline-flex", alignItems: "center", verticalAlign: "middle",
              padding: 0,
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        )}
      </div>
    </div>
  );
}
