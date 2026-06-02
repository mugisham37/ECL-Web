"use client";

import { useState } from "react";
import { MoreVertical, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { MemberRowMenu } from "./MemberRowMenu";
import type { Member, MemberRole } from "@/lib/admin-types";

interface MemberRowProps {
  member: Member;
  isLastAdmin: boolean;
  onRoleChange: (newRole: MemberRole) => void;
  onResendInvite: () => void;
  onRevokeInvite: () => void;
  onDisable: () => void;
  onEnable: () => void;
  onRemove: () => void;
  onRoleChangeRequest: (newRole: MemberRole) => void;
  animDelay?: number;
}

function StatusPill({ status }: { status: Member["status"] }) {
  if (status === "active")   return <span className="pill pill-success"><span className="dot" />Active</span>;
  if (status === "invited")  return <span className="pill pill-warning"><span className="dot" />Invited</span>;
  return <span className="pill pill-muted"><span className="dot" />Disabled</span>;
}

function RoleBadge({ role }: { role: MemberRole }) {
  return (
    <span className={`role-badge role-${role.toLowerCase()}`}>
      {role === "Admin" && <Shield size={13} aria-hidden />}
      {role}
    </span>
  );
}

export function MemberRow({
  member, isLastAdmin,
  onDisable, onEnable, onRemove,
  onResendInvite, onRevokeInvite,
  onRoleChangeRequest,
  animDelay = 0,
}: MemberRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value as MemberRole;
    if (newRole === member.role) return;
    if (member.role === "Admin" && isLastAdmin) return;
    onRoleChangeRequest(newRole);
    // Revert visually — confirm modal will re-apply
    e.target.value = member.role;
  }

  return (
    <motion.tr
      className={`member-row ${member.status === "invited" ? "invited" : ""} ${member.status === "disabled" ? "disabled" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay: animDelay }}
      style={{ display: "table-row" }}
    >
      {/* Member name/email */}
      <td>
        <div className="member-name">
          <span className="avatar avatar-sm">{member.initials}</span>
          <div className="mn-meta">
            {member.status === "invited" ? (
              <>
                <div className="n" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)" }}>{member.email}</div>
                <div className="e">Pending invitation</div>
              </>
            ) : (
              <>
                <div className="n">
                  {member.name}
                  {member.isYou && (
                    <span style={{ fontWeight: 400, color: "var(--text-subtle)", fontSize: "var(--fs-caption)", marginLeft: 6 }}>(you)</span>
                  )}
                </div>
                <div className="e">{member.email}</div>
              </>
            )}
          </div>
        </div>
      </td>

      {/* Role */}
      <td>
        {member.status === "invited" ? (
          <RoleBadge role={member.role} />
        ) : (
          <select
            className="role-select admin-editable"
            value={member.role}
            onChange={handleRoleChange}
            disabled={isLastAdmin && member.role === "Admin"}
            title={isLastAdmin && member.role === "Admin" ? "The last Admin cannot be demoted" : undefined}
            aria-label={`Role for ${member.name}`}
          >
            <option value="Admin">Admin</option>
            <option value="Analyst">Analyst</option>
            <option value="Reviewer">Reviewer</option>
          </select>
        )}
      </td>

      {/* Status */}
      <td><StatusPill status={member.status} /></td>

      {/* Last active */}
      <td style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
        {member.lastActive}
      </td>

      {/* Row menu */}
      <td>
        <div className="row-pop-wrap" style={{ justifyContent: "flex-end" }}>
          <button
            className="row-menu-btn admin-editable"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={`Actions for ${member.name}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <MoreVertical size={14} aria-hidden />
          </button>
          {menuOpen && (
            <MemberRowMenu
              member={member}
              isLastAdmin={isLastAdmin}
              onClose={() => setMenuOpen(false)}
              onResendInvite={() => { setMenuOpen(false); onResendInvite(); }}
              onRevokeInvite={() => { setMenuOpen(false); onRevokeInvite(); }}
              onDisable={() => { setMenuOpen(false); onDisable(); }}
              onEnable={() => { setMenuOpen(false); onEnable(); }}
              onRemove={() => { setMenuOpen(false); onRemove(); }}
            />
          )}
        </div>
      </td>
    </motion.tr>
  );
}
