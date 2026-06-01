"use client";

import { useState } from "react";
import { Hash, Copy, Check } from "lucide-react";

interface HashPillProps {
  hash: string;
  fullId?: string; // full value to copy; falls back to hash
}

export function HashPill({ hash, fullId }: HashPillProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullId ?? hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="hash-pill-btn"
      aria-label="Copy run ID"
      title={fullId ?? hash}
    >
      <Hash size={13} />
      <span>{hash}</span>
      {copied ? <Check size={13} style={{ color: "var(--success)" }} /> : <Copy size={13} />}
    </button>
  );
}
