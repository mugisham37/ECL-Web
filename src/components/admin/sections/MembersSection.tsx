"use client";

import { useState } from "react";
import { Plus, Eye, Shield, Mail, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { MemberRow } from "../members/MemberRow";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import type { Member, MemberRole, ModalKind } from "@/lib/admin-types";

interface MembersSectionProps {
  members: Member[];
  onUpdate: (members: Member[]) => void;
  onToast: (msg: string, kind?: "success" | "info" | "danger") => void;
}

function adminCount(members: Member[]) {
  return members.filter((m) => m.role === "Admin" && m.status === "active").length;
}

function initials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export function MembersSection({ members, onUpdate, onToast }: MembersSectionProps) {
  const [modal, setModal] = useState<ModalKind>(null);
  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("Analyst");
  const [inviteErr, setInviteErr] = useState(false);

  const admins = adminCount(members);

  function handleRoleChangeRequest(index: number, newRole: MemberRole) {
    const m = members[index];
    if (m.role === "Admin" && admins === 1) {
      onToast("Can't demote the last Admin.", "danger");
      return;
    }
    setModal({ type: "confirm-role", member: m, newRole, index });
  }

  function confirmRoleChange() {
    if (modal?.type !== "confirm-role") return;
    const { index, newRole } = modal;
    const next = members.map((m, i) => i === index ? { ...m, role: newRole } : m);
    onUpdate(next);
    onToast(`${modal.member.name} is now ${newRole}.`);
    setModal(null);
  }

  function handleDisable(index: number) {
    const m = members[index];
    if (m.role === "Admin" && admins === 1) { onToast("Can't disable the last Admin.", "danger"); return; }
    onUpdate(members.map((x, i) => i === index ? { ...x, status: "disabled" } : x));
    onToast(`${m.name} disabled.`, "info");
  }

  function handleEnable(index: number) {
    const m = members[index];
    onUpdate(members.map((x, i) => i === index ? { ...x, status: "active" } : x));
    onToast(`${m.name} re-enabled.`);
  }

  function handleResendInvite(m: Member) {
    onToast(`Invite resent to ${m.email}.`, "info");
  }

  function handleRevokeInvite(index: number) {
    const m = members[index];
    onUpdate(members.filter((_, i) => i !== index));
    onToast("Invite revoked.", "info");
  }

  function confirmRemove() {
    if (modal?.type !== "confirm-remove") return;
    const m = modal.member;
    onUpdate(members.filter((x) => x.id !== m.id));
    onToast(`${m.name} removed.`, "info");
    setModal(null);
  }

  function handleRemove(index: number) {
    const m = members[index];
    if (m.role === "Admin" && admins === 1) { onToast("Can't remove the last Admin.", "danger"); return; }
    setModal({ type: "confirm-remove", member: m });
  }

  function sendInvite() {
    const email = inviteEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setInviteErr(true); return; }
    const newMember: Member = {
      id: `inv-${Date.now()}`,
      name: email, email,
      initials: initials(email),
      role: inviteRole,
      status: "invited",
      lastActive: "Invited just now",
    };
    onUpdate([...members, newMember]);
    onToast(`Invite sent to ${email}.`);
    setModal(null);
    setInviteEmail(""); setInviteRole("Analyst"); setInviteErr(false);
  }

  return (
    <section className="admin-sec active" aria-labelledby="members-heading">
      <div className="sec-title-row">
        <div>
          <h2 id="members-heading">Members &amp; roles</h2>
          <p className="desc">People with access to Savanna Bank's workspace. Admins manage settings, Analysts run ECLs, Reviewers read results.</p>
        </div>
        <button
          className="btn btn-primary admin-editable"
          onClick={() => setModal({ type: "invite" })}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, height: "var(--control-h)", padding: "0 14px", border: "none", borderRadius: "var(--r-sm)", background: "var(--accent)", color: "#fff", fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)", cursor: "pointer", whiteSpace: "nowrap" }}
        >
          <Plus size={15} aria-hidden /> Invite member
        </button>
      </div>
      <hr className="sec-divider" />

      <div className="admin-table-wrap tbl-wrap">
        <table className="tbl" aria-label="Workspace members">
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <MemberRow
                key={m.id}
                member={m}
                isLastAdmin={m.role === "Admin" && admins === 1}
                onRoleChange={() => {}}
                onRoleChangeRequest={(newRole) => handleRoleChangeRequest(i, newRole)}
                onResendInvite={() => handleResendInvite(m)}
                onRevokeInvite={() => handleRevokeInvite(i)}
                onDisable={() => handleDisable(i)}
                onEnable={() => handleEnable(i)}
                onRemove={() => handleRemove(i)}
                animDelay={i * 0.03}
              />
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 14, fontSize: "var(--fs-caption)", color: "var(--text-subtle)" }}>
        A workspace must always have at least one Admin. The last Admin can't be removed or demoted.
      </p>

      {/* Invite modal */}
      {modal?.type === "invite" && (
        <div
          style={{ position: "fixed", inset: 0, background: "var(--scrim)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => setModal(null)}
          role="dialog" aria-modal="true" aria-label="Invite a member"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "clamp(20px,3vw,28px)", maxWidth: 440, width: "100%", boxShadow: "var(--shadow-modal)" }}
          >
            <h3 style={{ fontSize: "var(--fs-h2)", fontWeight: "var(--fw-semibold)" }}>Invite a member</h3>
            <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: "var(--fs-body)" }}>They'll get an email link to set a password and join.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
              <div className="field">
                <label htmlFor="inv-email" style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontWeight: "var(--fw-medium)" }}>Work email</label>
                <div className="input-wrap">
                  <Mail size={15} className="ic" aria-hidden />
                  <input
                    id="inv-email"
                    className={`input${inviteErr ? " is-error" : ""}`}
                    type="email"
                    placeholder="name@savannabank.co.ke"
                    value={inviteEmail}
                    onChange={(e) => { setInviteEmail(e.target.value); setInviteErr(false); }}
                    autoComplete="off"
                  />
                </div>
                {inviteErr && (
                  <span className="err" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "var(--fs-caption)", color: "var(--danger)", marginTop: 4 }}>
                    <AlertTriangle size={12} aria-hidden /> Enter a valid email.
                  </span>
                )}
              </div>
              <div className="field">
                <label htmlFor="inv-role" style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontWeight: "var(--fw-medium)" }}>Role</label>
                <select
                  id="inv-role"
                  className="select"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as MemberRole)}
                >
                  <option>Analyst</option>
                  <option>Reviewer</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, height: "var(--control-h)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", background: "var(--surface)", color: "var(--text)", fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)", cursor: "pointer" }}>Cancel</button>
              <button onClick={sendInvite} style={{ flex: 1, height: "var(--control-h)", border: "none", borderRadius: "var(--r-sm)", background: "var(--accent)", color: "#fff", fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Mail size={14} aria-hidden /> Send invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm role change modal */}
      <ConfirmModal
        open={modal?.type === "confirm-role"}
        onClose={() => setModal(null)}
        onConfirm={confirmRoleChange}
        title={modal?.type === "confirm-role" ? `Change role to ${modal.newRole}?` : ""}
        description={modal?.type === "confirm-role" ? (
          <span>
            {modal.member.name} will{" "}
            {modal.newRole === "Admin" ? "gain full admin access to settings and members"
              : modal.newRole === "Analyst" ? "be able to upload files and run ECLs"
              : "be able to read results only"}.
          </span>
        ) : ""}
        primaryLabel="Change role"
      />

      {/* Confirm remove modal */}
      <ConfirmModal
        open={modal?.type === "confirm-remove"}
        onClose={() => setModal(null)}
        onConfirm={confirmRemove}
        title={modal?.type === "confirm-remove" ? `Remove ${modal.member.name}?` : ""}
        description={modal?.type === "confirm-remove"
          ? "They'll immediately lose access to Savanna Bank. Runs they created stay in the audit trail."
          : ""}
        icon={
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--danger-subtle)", color: "var(--danger)", display: "grid", placeItems: "center" }}>
            <Shield size={20} aria-hidden />
          </div>
        }
        primaryLabel="Remove member"
        primaryVariant="danger"
      />
    </section>
  );
}
