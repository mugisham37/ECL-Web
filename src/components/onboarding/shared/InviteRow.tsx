"use client";

import { useState } from "react";
import { Trash2, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { InviteEntry } from "@/lib/onboarding-schema";

interface InviteRowProps {
  onCommit: (entry: InviteEntry) => void;
  onRemove: () => void;
  showRemove?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InviteRow({ onCommit, onRemove, showRemove = true }: InviteRowProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteEntry["role"]>("Analyst");
  const [error, setError] = useState(false);

  function handleBlur() {
    const trimmed = email.trim();
    if (!trimmed) return;
    if (!EMAIL_RE.test(trimmed)) {
      setError(true);
      return;
    }
    setError(false);
    onCommit({ email: trimmed, role });
    setEmail("");
    setRole("Analyst");
  }

  return (
    <div className="grid gap-2.5 mb-2.5 invite-row-grid">
      {/* Email input with mail icon */}
      <div className="relative">
        <Mail
          className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
          style={{ color: "var(--text-subtle)" }}
        />
        <Input
          type="email"
          placeholder="name@savannabank.co.ke"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(false); }}
          onBlur={handleBlur}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleBlur(); } }}
          className={cn("pl-9", error && "border-[var(--danger)]")}
          aria-invalid={error}
        />
      </div>

      {/* Role select */}
      <select
        className="h-9 w-full rounded-md px-3 text-sm transition-colors duration-120"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--text)",
        }}
        value={role}
        onChange={(e) => setRole(e.target.value as InviteEntry["role"])}
      >
        <option value="Analyst">Analyst</option>
        <option value="Reviewer">Reviewer</option>
        <option value="Administrator">Administrator</option>
      </select>

      {/* Remove button */}
      {showRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="size-9 flex items-center justify-center rounded-md transition-colors duration-120"
          style={{ color: "var(--text-subtle)", background: "none", border: "none", cursor: "pointer" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--danger)"; (e.currentTarget as HTMLElement).style.background = "var(--danger-subtle)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-subtle)"; (e.currentTarget as HTMLElement).style.background = "none"; }}
          aria-label="Remove invite row"
        >
          <Trash2 className="size-4" />
        </button>
      )}

      <style>{`
        .invite-row-grid { grid-template-columns: 1fr 150px 36px; }
        @media (max-width: 640px) {
          .invite-row-grid { grid-template-columns: 1fr; }
          .invite-row-grid > button { justify-self: end; }
        }
      `}</style>
    </div>
  );
}
