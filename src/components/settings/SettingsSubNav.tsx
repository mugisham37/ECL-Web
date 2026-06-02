import { User, Lock, Bell, Palette, Monitor } from "lucide-react";
import type { SettingsSection } from "@/lib/settings-types";

interface SettingsSubNavProps {
  activeSection: SettingsSection;
  onChange: (s: SettingsSection) => void;
}

const SECTIONS: Array<{ id: SettingsSection; label: string; Icon: React.ElementType }> = [
  { id: "profile",       label: "Profile",       Icon: User    },
  { id: "security",      label: "Security",      Icon: Lock    },
  { id: "notifications", label: "Notifications", Icon: Bell    },
  { id: "appearance",    label: "Appearance",    Icon: Palette },
  { id: "sessions",      label: "Sessions",      Icon: Monitor },
];

export function SettingsSubNav({ activeSection, onChange }: SettingsSubNavProps) {
  return (
    <nav className="admin-subnav" aria-label="Settings sections">
      <div className="sn-group">Account</div>
      {SECTIONS.map(({ id, label, Icon }) => (
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
        </a>
      ))}
    </nav>
  );
}
