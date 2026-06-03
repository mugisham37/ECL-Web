import { LayoutGrid, Building2, Users, Activity, Cpu, Clock } from "lucide-react";
import type { SuperAdminSection } from "@/lib/superadmin-types";

interface SuperAdminSubNavProps {
  activeSection: SuperAdminSection;
  tenantCount: number;
  onChange: (s: SuperAdminSection) => void;
}

const SECTIONS: Array<{
  id: SuperAdminSection;
  label: string;
  Icon: React.ElementType;
  badge?: (p: SuperAdminSubNavProps) => number;
}> = [
  { id: "overview", label: "Overview",         Icon: LayoutGrid },
  { id: "tenants",  label: "Tenants",           Icon: Building2, badge: (p) => p.tenantCount },
  { id: "users",    label: "Users",             Icon: Users },
  { id: "health",   label: "System health",     Icon: Activity },
  { id: "engine",   label: "Engine versions",   Icon: Cpu },
  { id: "audit",    label: "Audit log",         Icon: Clock },
];

export function SuperAdminSubNav(props: SuperAdminSubNavProps) {
  const { activeSection, onChange } = props;

  return (
    <nav className="admin-subnav" aria-label="Platform console sections">
      <div className="sn-group">
        <span className="platform-badge">Platform Ops</span>
      </div>

      {SECTIONS.map(({ id, label, Icon, badge }) => {
        const n = badge ? badge(props) : undefined;
        return (
          <a
            key={id}
            className={activeSection === id ? "active" : ""}
            onClick={() => onChange(id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onChange(id)}
            aria-current={activeSection === id ? "page" : undefined}
          >
            <Icon size={16} className="ic" aria-hidden />
            {label}
            {n !== undefined && (
              <span className="badge" aria-label={`${n} ${label}`}>{n}</span>
            )}
          </a>
        );
      })}
    </nav>
  );
}
