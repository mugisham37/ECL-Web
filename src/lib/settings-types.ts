export type ThemePref = "light" | "dark" | "system";
export type SettingsSection = "profile" | "security" | "notifications" | "appearance" | "sessions";

export interface NotifPrefs {
  runCompleted: boolean;
  runFailed: boolean;
  weeklySummary: boolean;
  memberJoined: boolean;
  productUpdates: boolean;
}

export type SessionIcon = "laptop" | "phone";

export interface Session {
  id: string;
  icon: SessionIcon;
  title: string;
  description: string;
  current: boolean;
}

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  role: string;
  initials: string;
}

export interface ToastItem {
  id: string;
  message: string;
  kind: "success" | "info" | "danger";
}

export type ModalKind =
  | { type: "sign-out-all" }
  | null;
