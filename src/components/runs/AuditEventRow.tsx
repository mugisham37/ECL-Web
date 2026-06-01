import {
  Check, X, Plus, Upload, Zap, Clock, Download, Trash2, Cpu,
} from "lucide-react";
import type { AuditEvent } from "@/lib/runs-types";

const ICON_MAP: Record<string, React.ElementType> = {
  Check, X, Plus, Upload, Zap, Clock, Download, Trash2, Cpu,
};

function getInitials(name: string) {
  if (name === "system") return null;
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export function AuditEventRow({ event }: { event: AuditEvent }) {
  const Icon = ICON_MAP[event.iconName] ?? Check;
  const initials = getInitials(event.who);

  return (
    <div className={`audit-ev ${event.kind}`}>
      <div className="ae-dot" aria-hidden="true">
        <Icon size={13} />
      </div>
      <div className="ae-body">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <p className="ae-t">{event.title}</p>
          <span className="ae-time">{event.time}</span>
        </div>
        <p className="ae-d">{event.description}</p>
        <div className="ae-meta">
          {initials ? (
            <span className="avatar" style={{ width: 18, height: 18, fontSize: 9, background: "var(--surface-sunken)", color: "var(--text-muted)" }}>
              {initials}
            </span>
          ) : (
            <span className="avatar" style={{ width: 18, height: 18, display: "grid", placeItems: "center", background: "var(--surface-sunken)", color: "var(--text-subtle)" }}>
              <Cpu size={10} />
            </span>
          )}
          <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{event.who}</span>
        </div>
      </div>
    </div>
  );
}
