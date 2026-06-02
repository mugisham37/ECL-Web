"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SettingsSubNav } from "./SettingsSubNav";
import { ProfileSection } from "./sections/ProfileSection";
import { SecuritySection } from "./sections/SecuritySection";
import { NotificationsSection } from "./sections/NotificationsSection";
import { AppearanceSection } from "./sections/AppearanceSection";
import { SessionsSection } from "./sections/SessionsSection";
import { SaveBar } from "@/components/shared/SaveBar";
import { ToastStack, makeToastId } from "@/components/shared/ToastStack";
import { SkeletonBlock } from "@/components/dashboard/shared/SkeletonBlock";
import { MOCK_USER_PROFILE, MOCK_NOTIF_PREFS, MOCK_SESSIONS } from "@/lib/settings-mock";
import type { SettingsSection, NotifPrefs, Session, ModalKind, ToastItem } from "@/lib/settings-types";

const FADE = {
  hidden:  { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0 },
  exit:    { opacity: 0 },
};

export function SettingsView() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [name,    setName]    = useState(MOCK_USER_PROFILE.name);
  const [title,   setTitle]   = useState(MOCK_USER_PROFILE.title);
  const [notifs,  setNotifs]  = useState<NotifPrefs>({ ...MOCK_NOTIF_PREFS });
  const [sessions,setSessions]= useState<Session[]>([...MOCK_SESSIONS]);
  const [profileDirty, setProfileDirty] = useState(false);
  const [modal,   setModal]   = useState<ModalKind>(null);
  const [toasts,  setToasts]  = useState<ToastItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  function handleNameChange(v: string)  { setName(v);  setProfileDirty(true); }
  function handleTitleChange(v: string) { setTitle(v); setProfileDirty(true); }

  function handleSaveProfile() {
    setProfileDirty(false);
    toast("Profile saved.");
  }

  function handleDiscardProfile() {
    setName(MOCK_USER_PROFILE.name);
    setTitle(MOCK_USER_PROFILE.title);
    setProfileDirty(false);
    toast("Changes discarded.", "info");
  }

  function handleSectionChange(section: SettingsSection) {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSignOut() {
    toast("Signing out…", "info");
  }

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <div className="page-head"><div><SkeletonBlock height={28} width={120} /></div></div>
        <div className="admin-wrap">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...Array(5)].map((_, i) => <SkeletonBlock key={i} height={38} />)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <SkeletonBlock height={180} />
            <SkeletonBlock height={120} />
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
    >
      {/* Page header */}
      <div className="page-head" style={{ marginBottom: "var(--sp-4)" }}>
        <div>
          <h1>Account</h1>
          <div className="ph-sub">
            <span>{name}</span>
            <span style={{ color: "var(--text-subtle)" }}>·</span>
            <span>Your personal settings</span>
          </div>
        </div>
      </div>

      <div className="admin-wrap">
        <SettingsSubNav activeSection={activeSection} onChange={handleSectionChange} />

        <div className="admin-content">
          <AnimatePresence mode="wait">
            {activeSection === "profile" && (
              <motion.div key="profile" variants={FADE} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.15 }}>
                <ProfileSection
                  profile={MOCK_USER_PROFILE}
                  name={name}
                  title={title}
                  onNameChange={handleNameChange}
                  onTitleChange={handleTitleChange}
                  onUploadClick={() => toast("Photo upload is a stub in this prototype.", "info")}
                />
              </motion.div>
            )}
            {activeSection === "security" && (
              <motion.div key="security" variants={FADE} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.15 }}>
                <SecuritySection onToast={toast} />
              </motion.div>
            )}
            {activeSection === "notifications" && (
              <motion.div key="notifications" variants={FADE} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.15 }}>
                <NotificationsSection prefs={notifs} onChange={setNotifs} onToast={toast} />
              </motion.div>
            )}
            {activeSection === "appearance" && (
              <motion.div key="appearance" variants={FADE} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.15 }}>
                <AppearanceSection onToast={toast} />
              </motion.div>
            )}
            {activeSection === "sessions" && (
              <motion.div key="sessions" variants={FADE} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.15 }}>
                <SessionsSection
                  sessions={sessions}
                  modal={modal}
                  onUpdate={setSessions}
                  onSetModal={setModal}
                  onToast={toast}
                  onSignOut={handleSignOut}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Save bar (profile dirty) */}
      <SaveBar
        visible={activeSection === "profile" && profileDirty}
        message="You have unsaved profile changes."
        onSave={handleSaveProfile}
        onDiscard={handleDiscardProfile}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </motion.div>
  );
}
