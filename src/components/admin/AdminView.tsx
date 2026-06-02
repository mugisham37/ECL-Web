"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye } from "lucide-react";
import { AdminSubNav } from "./AdminSubNav";
import { MembersSection } from "./sections/MembersSection";
import { SegmentsSection } from "./sections/SegmentsSection";
import { CollateralSection } from "./sections/CollateralSection";
import { TenantProfileSection } from "./sections/TenantProfileSection";
import { SaveBar } from "@/components/shared/SaveBar";
import { ToastStack, makeToastId } from "@/components/shared/ToastStack";
import { SkeletonBlock } from "@/components/dashboard/shared/SkeletonBlock";
import {
  MOCK_MEMBERS, MOCK_SEGMENTS_ADMIN, MOCK_COLLATERAL, MOCK_TENANT_PROFILE,
} from "@/lib/admin-mock";
import type {
  AdminSection, Member, AdminSegment, CollateralType,
  TenantProfile, ModalKind, ToastItem,
} from "@/lib/admin-types";

interface AdminViewProps {
  userRole?: string;
}

const FADE = {
  hidden:  { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0 },
  exit:    { opacity: 0 },
};

export function AdminView({ userRole = "Administrator" }: AdminViewProps) {
  const isAdmin = userRole === "Administrator";

  const [activeSection, setActiveSection] = useState<AdminSection>("members");
  const [members,    setMembers]    = useState<Member[]>([...MOCK_MEMBERS]);
  const [segments,   setSegments]   = useState<AdminSegment[]>([...MOCK_SEGMENTS_ADMIN]);
  const [collateral, setCollateral] = useState<CollateralType[]>([...MOCK_COLLATERAL]);
  const [profile,    setProfile]    = useState<TenantProfile>({ ...MOCK_TENANT_PROFILE });
  const [dirtySection, setDirtySection] = useState<AdminSection | null>(null);
  const [modal,    setModal]    = useState<ModalKind>(null);
  const [toasts,   setToasts]   = useState<ToastItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Snapshot for discard
  const snapshots = useRef({ members, segments, collateral, profile });

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const toast = useCallback((message: string, kind: ToastItem["kind"] = "success") => {
    const id = makeToastId();
    setToasts((prev) => [...prev, { id, message, kind }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  function markDirty(section: AdminSection) {
    if (dirtySection !== section) {
      snapshots.current = { members, segments, collateral, profile };
      setDirtySection(section);
    }
  }

  function handleSave() {
    setDirtySection(null);
    toast("Changes saved. They apply to future runs.");
  }

  function handleDiscard() {
    const s = snapshots.current;
    setMembers([...s.members]);
    setSegments([...s.segments]);
    setCollateral([...s.collateral]);
    setProfile({ ...s.profile });
    setDirtySection(null);
    toast("Changes discarded.", "info");
  }

  function handleSectionChange(section: AdminSection) {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <div className="page-head">
          <div><SkeletonBlock height={28} width={120} /></div>
        </div>
        <div className="admin-wrap">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...Array(4)].map((_, i) => <SkeletonBlock key={i} height={38} />)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <SkeletonBlock height={60} />
            {[...Array(5)].map((_, i) => <SkeletonBlock key={i} height={52} className="skel-row" />)}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      data-role={isAdmin ? "admin" : "viewer"}
    >
      {/* Page header */}
      <div className="page-head" style={{ marginBottom: "var(--sp-4)" }}>
        <div>
          <h1>Admin</h1>
          <div className="ph-sub">
            <span>Savanna Bank PLC</span>
            <span style={{ color: "var(--text-subtle)" }}>·</span>
            <span>Manage your workspace</span>
          </div>
        </div>
      </div>

      {/* Viewer readonly note */}
      {!isAdmin && (
        <div className="readonly-note">
          <Eye size={14} className="ic" aria-hidden />
          You're viewing as an <strong style={{ marginLeft: 3 }}>{userRole}</strong> — Admin settings are read-only. Ask a Tenant Admin to make changes.
        </div>
      )}

      <div className="admin-wrap">
        <AdminSubNav
          activeSection={activeSection}
          members={members}
          segments={segments}
          collateral={collateral}
          onChange={handleSectionChange}
        />

        <div className="admin-content">
          <AnimatePresence mode="wait">
            {activeSection === "members" && (
              <motion.div key="members" variants={FADE} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.15 }}>
                <MembersSection
                  members={members}
                  onUpdate={setMembers}
                  onToast={toast}
                />
              </motion.div>
            )}
            {activeSection === "segments" && (
              <motion.div key="segments" variants={FADE} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.15 }}>
                <SegmentsSection
                  segments={segments}
                  modal={modal}
                  onUpdate={setSegments}
                  onMarkDirty={() => markDirty("segments")}
                  onToast={toast}
                  onSetModal={setModal}
                />
              </motion.div>
            )}
            {activeSection === "collateral" && (
              <motion.div key="collateral" variants={FADE} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.15 }}>
                <CollateralSection
                  collateral={collateral}
                  modal={modal}
                  onUpdate={setCollateral}
                  onMarkDirty={() => markDirty("collateral")}
                  onToast={toast}
                  onSetModal={setModal}
                />
              </motion.div>
            )}
            {activeSection === "profile" && (
              <motion.div key="profile" variants={FADE} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.15 }}>
                <TenantProfileSection
                  profile={profile}
                  modal={modal}
                  onUpdate={setProfile}
                  onMarkDirty={() => markDirty("profile")}
                  onToast={toast}
                  onSetModal={setModal}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Save bar */}
      <SaveBar
        visible={dirtySection !== null}
        message={`You have unsaved changes in ${dirtySection}.`}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />

      {/* Toast stack */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </motion.div>
  );
}
