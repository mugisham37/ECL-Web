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
import { useApiSession } from "@/hooks/use-api-session";
import {
  fetchMe,
  fetchNotificationPrefs,
  fetchSessions,
  updateNotificationPrefs,
  updateProfile,
  revokeSession,
  revokeOtherSessions,
} from "@/lib/api/settings";
import type { SettingsSection, NotifPrefs, Session, ModalKind, ToastItem } from "@/lib/settings-types";

const FADE = {
  hidden:  { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0 },
  exit:    { opacity: 0 },
};

export function SettingsView() {
  const { token } = useApiSession();
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [name,    setName]    = useState("");
  const [title,   setTitle]   = useState("");
  const [email,   setEmail]   = useState("");
  const [role,    setRole]    = useState("");
  const [notifs,  setNotifs]  = useState<NotifPrefs>({
    runCompleted: true, runFailed: true, weeklySummary: false, memberJoined: true, productUpdates: false,
  });
  const [sessions,setSessions]= useState<Session[]>([]);
  const [profileDirty, setProfileDirty] = useState(false);
  const [modal,   setModal]   = useState<ModalKind>(null);
  const [toasts,  setToasts]  = useState<ToastItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useCallback((message: string, kind: ToastItem["kind"] = "success") => {
    const id = makeToastId();
    setToasts((prev) => [...prev, { id, message, kind }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const [profile, prefs, sess] = await Promise.all([
          fetchMe(token),
          fetchNotificationPrefs(token),
          fetchSessions(token),
        ]);
        if (cancelled) return;
        setName(profile.name);
        setTitle(profile.title);
        setEmail(profile.email);
        setRole(profile.role);
        setNotifs(prefs);
        setSessions(sess);
      } catch {
        if (!cancelled) setToasts((prev) => [...prev, { id: makeToastId(), message: "Failed to load settings.", kind: "danger" }]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  function handleNameChange(v: string)  { setName(v);  setProfileDirty(true); }
  function handleTitleChange(v: string) { setTitle(v); setProfileDirty(true); }

  async function handleSaveProfile() {
    if (!token) return;
    try {
      await updateProfile(token, { name, title });
      setProfileDirty(false);
      toast("Profile saved.");
    } catch {
      toast("Failed to save profile.", "danger");
    }
  }

  function handleDiscardProfile() {
    if (!token) return;
    fetchMe(token).then((p) => {
      setName(p.name);
      setTitle(p.title);
      setProfileDirty(false);
      toast("Changes discarded.", "info");
    });
  }

  async function handleNotifChange(key: keyof NotifPrefs, value: boolean) {
    if (!token) return;
    const next = { ...notifs, [key]: value };
    setNotifs(next);
    try {
      await updateNotificationPrefs(token, next);
    } catch {
      toast("Failed to update preferences.", "danger");
    }
  }

  async function handleRevokeSession(id: string) {
    if (!token) return;
    try {
      await revokeSession(token, id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast("Session revoked.");
    } catch {
      toast("Failed to revoke session.", "danger");
    }
  }

  async function handleRevokeOthers() {
    if (!token) return;
    try {
      await revokeOtherSessions(token);
      setSessions((prev) => prev.filter((s) => s.current));
      setModal(null);
      toast("Other sessions signed out.");
    } catch {
      toast("Failed to sign out other sessions.", "danger");
    }
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
                  profile={{ name, title, email, role, initials: name.slice(0, 2).toUpperCase() }}
                  name={name}
                  title={title}
                  onNameChange={handleNameChange}
                  onTitleChange={handleTitleChange}
                  onUploadClick={() => toast("Photo upload available via API.", "info")}
                />
              </motion.div>
            )}
            {activeSection === "security" && (
              <motion.div key="security" variants={FADE} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.15 }}>
                <SecuritySection token={token} onToast={toast} />
              </motion.div>
            )}
            {activeSection === "notifications" && (
              <motion.div key="notifications" variants={FADE} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.15 }}>
                <NotificationsSection prefs={notifs} onToggle={handleNotifChange} onToast={toast} />
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
                  onRevokeOne={handleRevokeSession}
                  onRevokeAll={handleRevokeOthers}
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
