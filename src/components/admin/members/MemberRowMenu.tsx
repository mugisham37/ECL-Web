"use client";

import { useEffect, useRef } from "react";
import { RefreshCw, Ban, CheckCircle, Trash2, X } from "lucide-react";
import type { Member } from "@/lib/admin-types";

interface MemberRowMenuProps {
  member: Member;
  isLastAdmin: boolean;
  onClose: () => void;
  onResendInvite: () => void;
  onRevokeInvite: () => void;
  onDisable: () => void;
  onEnable: () => void;
  onRemove: () => void;
}

export function MemberRowMenu({
  member, isLastAdmin, onClose,
  onResendInvite, onRevokeInvite, onDisable, onEnable, onRemove,
}: MemberRowMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  return (
    <div className="row-pop" ref={ref} role="menu">
      {member.status === "invited" ? (
        <>
          <button role="menuitem" onClick={onResendInvite}>
            <RefreshCw size={14} className="ic" aria-hidden /> Resend invite
          </button>
          <div className="rp-sep" />
          <button role="menuitem" className="danger" onClick={onRevokeInvite}>
            <X size={14} className="ic" aria-hidden /> Revoke invite
          </button>
        </>
      ) : (
        <>
          {member.status === "active" ? (
            <button
              role="menuitem"
              onClick={isLastAdmin ? undefined : onDisable}
              disabled={isLastAdmin}
              title={isLastAdmin ? "Can't disable the last Admin" : undefined}
            >
              <Ban size={14} className="ic" aria-hidden /> Disable access
            </button>
          ) : (
            <button role="menuitem" onClick={onEnable}>
              <CheckCircle size={14} className="ic" aria-hidden /> Re-enable access
            </button>
          )}
          <div className="rp-sep" />
          <button
            role="menuitem"
            className="danger"
            onClick={isLastAdmin ? undefined : onRemove}
            disabled={isLastAdmin}
            title={isLastAdmin ? "Can't remove the last Admin" : undefined}
          >
            <Trash2 size={14} className="ic" aria-hidden /> Remove from workspace
          </button>
        </>
      )}
    </div>
  );
}
