import { X } from "lucide-react";
import type { InviteEntry } from "@/lib/onboarding-schema";

interface InviteChipProps {
  invite: InviteEntry;
  onRemove: () => void;
}

function initials(email: string): string {
  const parts = email.split("@")[0].split(/[._-]/);
  const first = (parts[0] ?? "")[0] ?? "";
  const second = parts[1] ? parts[1][0] : "";
  return (first + second).toUpperCase().slice(0, 2) || email[0].toUpperCase();
}

export function InviteChip({ invite, onRemove }: InviteChipProps) {
  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 rounded-md"
      style={{
        border: "1px solid var(--border)",
        background: "var(--surface-sunken)",
      }}
    >
      {/* Avatar */}
      <span
        className="size-6 rounded-full flex items-center justify-center text-[10px] font-semibold flex-none"
        style={{
          background: "var(--accent-subtle)",
          color: "var(--accent)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {initials(invite.email)}
      </span>

      <span className="text-sm flex-1 min-w-0 truncate" style={{ color: "var(--text)" }}>
        {invite.email}
      </span>

      <span
        className="text-xs px-2 py-0.5 rounded-full flex-none"
        style={{
          background: "var(--surface-sunken)",
          color: "var(--text-muted)",
          border: "1px solid var(--border)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {invite.role}
      </span>

      <button
        type="button"
        onClick={onRemove}
        className="size-5 flex items-center justify-center rounded flex-none transition-colors duration-120"
        style={{ color: "var(--text-subtle)", background: "none", border: "none", cursor: "pointer" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--danger)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-subtle)"; }}
        aria-label={`Remove ${invite.email}`}
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
