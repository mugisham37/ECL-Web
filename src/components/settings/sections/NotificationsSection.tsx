"use client";

import type { NotifPrefs } from "@/lib/settings-types";

interface NotifSectionProps {
  prefs: NotifPrefs;
  onChange: (prefs: NotifPrefs) => void;
  onToast: (msg: string, kind?: "success" | "info" | "danger") => void;
}

type NotifKey = keyof NotifPrefs;

const GROUPS: Array<{
  label: string;
  items: Array<{ key: NotifKey; title: string; desc: string }>;
}> = [
  {
    label: "Runs",
    items: [
      { key: "runCompleted",  title: "Run completed",  desc: "When an ECL run finishes successfully." },
      { key: "runFailed",     title: "Run failed",     desc: "When a run stops with an error." },
      { key: "weeklySummary", title: "Weekly summary", desc: "A Monday digest of the week's runs." },
    ],
  },
  {
    label: "Workspace",
    items: [
      { key: "memberJoined",   title: "Member joined",   desc: "When someone accepts an invite." },
      { key: "productUpdates", title: "Product updates", desc: "New features and engine version notes." },
    ],
  },
];

export function NotificationsSection({ prefs, onChange, onToast }: NotifSectionProps) {
  function toggle(key: NotifKey) {
    onChange({ ...prefs, [key]: !prefs[key] });
    onToast("Notification preference saved.", "info");
  }

  return (
    <section className="set-sec active" aria-labelledby="notif-sec-heading">
      <div className="set-card">
        <div className="set-card-head">
          <h3 id="notif-sec-heading">Notifications</h3>
          <p>Choose what reaches your inbox. In-app notifications are always on.</p>
        </div>
        <div className="set-card-body">
          {GROUPS.map((group) => (
            <div key={group.label} className="notif-group">
              <div className="ng-label">{group.label}</div>
              <div className="notif-cols-head">
                <span />
                <span>Email</span>
              </div>
              {group.items.map(({ key, title, desc }, i) => (
                <div key={key} className="notif-item-row" style={i === 0 ? { borderTop: 0 } : undefined}>
                  <div>
                    <div className="ni-t">{title}</div>
                    <div className="ni-d">{desc}</div>
                  </div>
                  <div className="sw-cell">
                    <label className="switch" aria-label={title}>
                      <input
                        type="checkbox"
                        checked={prefs[key]}
                        onChange={() => toggle(key)}
                      />
                      <span className="track" />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
