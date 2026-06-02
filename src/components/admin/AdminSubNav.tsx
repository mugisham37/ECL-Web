import { Users, Layers, Shield, Building } from "lucide-react";
import type { AdminSection, Member, AdminSegment, CollateralType } from "@/lib/admin-types";

interface AdminSubNavProps {
  activeSection: AdminSection;
  members: Member[];
  segments: AdminSegment[];
  collateral: CollateralType[];
  onChange: (s: AdminSection) => void;
}

const SECTIONS: Array<{
  id: AdminSection;
  label: string;
  Icon: React.ElementType;
  count?: (p: AdminSubNavProps) => number;
}> = [
  { id: "members",    label: "Members",       Icon: Users,    count: (p) => p.members.length },
  { id: "segments",   label: "Segments",      Icon: Layers,   count: (p) => p.segments.filter((s) => !s.disabled).length },
  { id: "collateral", label: "Collateral",    Icon: Shield,   count: (p) => p.collateral.length },
  { id: "profile",    label: "Tenant profile",Icon: Building },
];

export function AdminSubNav(props: AdminSubNavProps) {
  const { activeSection, onChange } = props;

  return (
    <nav className="admin-subnav" aria-label="Admin sections">
      <div className="sn-group">Workspace</div>
      {SECTIONS.map(({ id, label, Icon, count }) => {
        const n = count ? count(props) : undefined;
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
