import type { NotifPrefs, Session, UserProfile } from "./settings-types";

export const MOCK_USER_PROFILE: UserProfile = {
  name: "Tendai Mwangi",
  title: "Head of Credit Risk",
  email: "t.mwangi@savannabank.co.ke",
  role: "Administrator",
  initials: "TM",
};

export const MOCK_NOTIF_PREFS: NotifPrefs = {
  runCompleted: true,
  runFailed: true,
  weeklySummary: false,
  memberJoined: true,
  productUpdates: false,
};

export const MOCK_SESSIONS: Session[] = [
  {
    id: "s1",
    icon: "laptop",
    title: "MacBook Pro · Chrome",
    description: "Nairobi, Kenya · current session",
    current: true,
  },
  {
    id: "s2",
    icon: "laptop",
    title: "Windows · Edge",
    description: "Nairobi, Kenya · 2 hours ago",
    current: false,
  },
  {
    id: "s3",
    icon: "phone",
    title: "iPhone · Safari",
    description: "Mombasa, Kenya · yesterday",
    current: false,
  },
];
