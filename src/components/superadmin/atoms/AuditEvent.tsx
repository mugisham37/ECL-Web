import {
  Rocket, Ban, Fingerprint, Cpu, Users,
  AlertTriangle, X, Check,
} from "lucide-react";
import type { AuditEntry } from "@/lib/superadmin-types";

const ICON_MAP: Record<string, React.ElementType> = {
  Rocket, Ban, Fingerprint, Cpu, Users, AlertTriangle, X, Check,
};

interface AuditEventProps {
  entry: AuditEntry;
  showActor?: boolean;
}

export function AuditEvent({ entry, showActor = false }: AuditEventProps) {
  const Icon = ICON_MAP[entry.icon] ?? Check;

  return (
    <div className={`audit-ev ${entry.cls}`}>
      <div className="ae-dot" aria-hidden>
        <Icon size={14} />
      </div>
      <div className="ae-body">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div className="ae-t">{entry.title}</div>
          <span className="ae-time">{entry.timestamp}</span>
        </div>
        <div className="ae-d">{entry.description}</div>
        {showActor && entry.actor && (
          <div className="ae-actor">{entry.actor}</div>
        )}
      </div>
    </div>
  );
}
