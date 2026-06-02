import { Globe, Cpu, Server, Mail } from "lucide-react";
import type { HealthService } from "@/lib/superadmin-types";

const ICON_MAP: Record<string, React.ElementType> = {
  Globe,
  Cpu,
  Server,
  Mail,
};

const STATE_CLASS: Record<string, string> = {
  ok:   "health-ok",
  warn: "health-warn",
  down: "health-down",
};

const STATE_LABEL: Record<string, string> = {
  ok:   "Operational",
  warn: "Degraded",
  down: "Outage",
};

interface HealthCardProps {
  service: HealthService;
}

export function HealthCard({ service }: HealthCardProps) {
  const Icon = ICON_MAP[service.icon] ?? Globe;
  const stateClass = STATE_CLASS[service.state];
  const stateLabel = STATE_LABEL[service.state];

  return (
    <div
      className={stateClass}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: 16, border: "1px solid var(--border)",
        borderRadius: "var(--r-md)", background: "var(--surface)",
      }}
    >
      <span className="hc-led" />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "var(--fw-medium)" as string, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon size={14} style={{ color: "var(--text-muted)" }} aria-hidden />
          {service.name}
        </div>
        <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 2 }}>{stateLabel}</div>
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
        {service.state === "down" ? "unreachable" : service.value}
      </span>
    </div>
  );
}
