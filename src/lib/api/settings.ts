import { apiFetch } from "./client";
import { mapNotifPrefs, mapSession, mapUserProfile, mapNotification } from "./mappers";
import type { NotificationRaw } from "./mappers";
import type { NotifPrefs, Session, UserProfile } from "@/lib/settings-types";
import type { Notification } from "@/lib/dashboard-types";

export async function fetchMe(token: string) {
  const data = await apiFetch<{ user: Parameters<typeof mapUserProfile>[0]["user"] }>("/me", { token });
  return mapUserProfile(data);
}

export async function updateProfile(token: string, body: { name?: string; title?: string }) {
  await apiFetch("/me", { method: "PATCH", token, body: JSON.stringify(body) });
}

export async function updatePassword(token: string, body: { current_password: string; new_password: string }) {
  await apiFetch("/me/password", { method: "PATCH", token, body: JSON.stringify(body) });
}

export async function fetchNotificationPrefs(token: string): Promise<NotifPrefs> {
  const data = await apiFetch<Parameters<typeof mapNotifPrefs>[0]>("/me/notification-preferences", { token });
  return mapNotifPrefs(data);
}

export async function updateNotificationPrefs(token: string, prefs: Partial<NotifPrefs>) {
  const data = await apiFetch<Parameters<typeof mapNotifPrefs>[0]>("/me/notification-preferences", {
    method: "PATCH",
    token,
    body: JSON.stringify({
      run_completed: prefs.runCompleted,
      run_failed: prefs.runFailed,
      weekly_summary: prefs.weeklySummary,
      member_joined: prefs.memberJoined,
      product_updates: prefs.productUpdates,
    }),
  });
  return mapNotifPrefs(data);
}

export async function fetchSessions(token: string): Promise<Session[]> {
  const data = await apiFetch<Parameters<typeof mapSession>[0][]>("/me/sessions", { token });
  return data.map(mapSession);
}

export async function revokeSession(token: string, sessionId: string) {
  await apiFetch(`/me/sessions/${sessionId}`, { method: "DELETE", token });
}

export async function revokeOtherSessions(token: string) {
  return apiFetch<{ message: string }>("/me/sessions", { method: "DELETE", token });
}

export async function uploadAvatar(token: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  return apiFetch<{ avatar_url: string }>("/me/avatar", { method: "POST", token, body: form });
}

export async function deleteAvatar(token: string) {
  await apiFetch("/me/avatar", { method: "DELETE", token });
}

export async function enrollTotp(token: string) {
  return apiFetch<{ qr_code_uri: string; qr_code_image: string; manual_entry_key: string }>(
    "/me/mfa/totp/enroll",
    { method: "POST", token },
  );
}

export async function confirmTotp(token: string, code: string) {
  return apiFetch<{ codes: string[] }>("/me/mfa/totp/confirm", {
    method: "POST",
    token,
    body: JSON.stringify({ code }),
  });
}

export async function disableTotp(token: string, code: string) {
  await apiFetch("/me/mfa/totp", {
    method: "DELETE",
    token,
    body: JSON.stringify({ code }),
  });
}

export async function fetchNotifications(token: string): Promise<Notification[]> {
  const data = await apiFetch<NotificationRaw[]>("/me/notifications", { token });
  return (data ?? []).map(mapNotification);
}

export async function markNotificationRead(token: string, notificationId: string) {
  await apiFetch(`/me/notifications/${notificationId}/read`, { method: "PATCH", token });
}

export async function markAllNotificationsRead(token: string) {
  await apiFetch<{ message: string }>("/me/notifications/read-all", { method: "POST", token });
}
