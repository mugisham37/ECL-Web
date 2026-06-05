"use client";

import { Laptop, Smartphone, LogOut } from "lucide-react";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import type { Session, ModalKind } from "@/lib/settings-types";

interface SessionsSectionProps {
  sessions: Session[];
  modal: ModalKind;
  onUpdate?: (sessions: Session[]) => void;
  onRevokeOne?: (id: string) => void;
  onRevokeAll?: () => void;
  onSetModal: (m: ModalKind) => void;
  onToast: (msg: string, kind?: "success" | "info" | "danger") => void;
  onSignOut: () => void;
}

function SessionIcon({ icon }: { icon: Session["icon"] }) {
  const style = { color: "inherit" };
  return icon === "phone" ? <Smartphone size={18} style={style} aria-hidden /> : <Laptop size={18} style={style} aria-hidden />;
}

export function SessionsSection({ sessions, modal, onUpdate, onRevokeOne, onRevokeAll, onSetModal, onToast, onSignOut }: SessionsSectionProps) {
  function signOutOne(id: string) {
    if (onRevokeOne) {
      onRevokeOne(id);
      return;
    }
    const s = sessions.find((x) => x.id === id);
    onUpdate?.(sessions.filter((x) => x.id !== id));
    if (s) onToast(`Signed out of ${s.title}.`, "info");
  }

  function confirmSignOutAll() {
    if (onRevokeAll) {
      onRevokeAll();
      return;
    }
    onUpdate?.(sessions.filter((s) => s.current));
    onToast("Signed out of all other devices.", "info");
    onSetModal(null);
  }

  return (
    <section className="set-sec active" aria-labelledby="sessions-sec-heading">
      {/* Active sessions card */}
      <div className="set-card">
        <div className="set-card-head" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h3 id="sessions-sec-heading">Active sessions</h3>
            <p>Devices currently signed in to your account.</p>
          </div>
          <button
            onClick={() => onSetModal({ type: "sign-out-all" })}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 32, padding: "0 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", background: "var(--surface)", color: "var(--text)", fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
          >
            <LogOut size={13} aria-hidden /> Sign out everywhere
          </button>
        </div>
        <div className="set-card-body">
          {sessions.map((s) => (
            <div key={s.id} className={`session-row${s.current ? " current" : ""}`}>
              <div className="se-ic">
                <SessionIcon icon={s.icon} />
              </div>
              <div className="se-meta">
                <div className="t">
                  {s.title}
                  {s.current && (
                    <span className="pill pill-success" style={{ height: 18, fontSize: 10 }}>This device</span>
                  )}
                </div>
                <div className="d">{s.description}</div>
              </div>
              {!s.current && (
                <button
                  onClick={() => signOutOne(s.id)}
                  style={{ height: 30, padding: "0 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", background: "var(--surface)", color: "var(--text)", fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", cursor: "pointer", flexShrink: 0 }}
                >
                  Sign out
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sign out this device card */}
      <div className="set-card">
        <div className="set-card-body" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div className="sr-meta">
            <div className="t" style={{ fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"] }}>Sign out</div>
            <div className="d" style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 2 }}>End your session on this device.</div>
          </div>
          <button
            onClick={onSignOut}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 32, padding: "0 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", background: "var(--surface)", color: "var(--text)", fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", cursor: "pointer", flexShrink: 0 }}
          >
            <LogOut size={13} aria-hidden /> Sign out
          </button>
        </div>
      </div>

      <p style={{ marginTop: 14, fontSize: "var(--fs-caption)", color: "var(--text-subtle)" }}>
        Account deletion is managed by your tenant admin. Ask an Admin to remove your access if you're leaving.
      </p>

      {/* Sign out all confirm */}
      <ConfirmModal
        open={modal?.type === "sign-out-all"}
        onClose={() => onSetModal(null)}
        onConfirm={confirmSignOutAll}
        title="Sign out everywhere?"
        description="All other devices will be signed out. This device stays active."
        icon={
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--warning-subtle)", color: "var(--warning)", display: "grid", placeItems: "center" }}>
            <LogOut size={20} aria-hidden />
          </div>
        }
        primaryLabel="Sign out others"
      />
    </section>
  );
}
