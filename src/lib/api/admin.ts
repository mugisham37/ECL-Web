import { apiFetch } from "./client";
import { mapCollateral, mapMember, mapSegment, mapTenantProfile } from "./mappers";
import type { CollateralType, Member, AdminSegment, TenantProfile } from "@/lib/admin-types";

export async function fetchMembers(token: string, tenantId: string): Promise<Member[]> {
  const res = await apiFetch<Parameters<typeof mapMember>[0][]>(
    `/tenants/${tenantId}/members?per_page=100`,
    { token },
  );
  return (Array.isArray(res) ? res : []).map(mapMember);
}

export async function fetchSegments(token: string, tenantId: string): Promise<AdminSegment[]> {
  const data = await apiFetch<Parameters<typeof mapSegment>[0][]>(`/tenants/${tenantId}/segments`, { token });
  return data.map(mapSegment);
}

export async function fetchCollateral(token: string, tenantId: string): Promise<CollateralType[]> {
  const data = await apiFetch<Parameters<typeof mapCollateral>[0][]>(
    `/tenants/${tenantId}/collateral-types`,
    { token },
  );
  return data.map(mapCollateral);
}

export async function fetchTenantProfile(token: string, tenantId: string): Promise<TenantProfile> {
  const data = await apiFetch<Parameters<typeof mapTenantProfile>[0]>(`/tenants/${tenantId}`, { token });
  return mapTenantProfile(data);
}

export async function updateTenantProfile(
  token: string,
  tenantId: string,
  body: Partial<{ name: string; reporting_cadence: string; timezone: string }>,
) {
  await apiFetch(`/tenants/${tenantId}`, { method: "PATCH", token, body: JSON.stringify(body) });
}

export async function closeTenant(token: string, tenantId: string) {
  await apiFetch(`/tenants/${tenantId}`, {
    method: "DELETE",
    token,
    body: JSON.stringify({ confirmation: "CLOSE" }),
  });
}

export async function sendInvite(
  token: string,
  tenantId: string,
  email: string,
  role: string,
) {
  const roleMap: Record<string, string> = { Admin: "administrator", Analyst: "analyst", Reviewer: "reviewer" };
  await apiFetch("/invites", {
    method: "POST",
    token,
    body: JSON.stringify({ email, role: roleMap[role] ?? role.toLowerCase(), tenant_id: tenantId }),
  });
}

export async function updateMember(
  token: string,
  tenantId: string,
  userId: string,
  body: { role?: string; status?: string },
) {
  const roleMap: Record<string, string> = { Admin: "administrator", Analyst: "analyst", Reviewer: "reviewer" };
  const payload: { role?: string; status?: string } = {};
  if (body.role) payload.role = roleMap[body.role] ?? body.role.toLowerCase();
  if (body.status) payload.status = body.status;
  await apiFetch(`/tenants/${tenantId}/members/${userId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function removeMember(token: string, tenantId: string, userId: string) {
  await apiFetch(`/tenants/${tenantId}/members/${userId}`, { method: "DELETE", token });
}

export async function updateSegment(
  token: string,
  tenantId: string,
  segmentId: string,
  body: { name?: string; code?: string; is_active?: boolean },
) {
  await apiFetch(`/tenants/${tenantId}/segments/${segmentId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(body),
  });
}

export async function createSegment(
  token: string,
  tenantId: string,
  body: { name: string; code?: string },
) {
  return apiFetch(`/tenants/${tenantId}/segments`, {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}

export async function deleteSegment(token: string, tenantId: string, segmentId: string) {
  await apiFetch(`/tenants/${tenantId}/segments/${segmentId}`, { method: "DELETE", token });
}

export async function updateCollateral(
  token: string,
  tenantId: string,
  id: string,
  body: { name?: string; haircut?: number; time_to_realize?: number },
) {
  await apiFetch(`/tenants/${tenantId}/collateral-types/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(body),
  });
}

export async function createCollateral(
  token: string,
  tenantId: string,
  body: { name: string; haircut: number; time_to_realize: number },
) {
  return apiFetch(`/tenants/${tenantId}/collateral-types`, {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}

export async function deleteCollateral(token: string, tenantId: string, id: string) {
  await apiFetch(`/tenants/${tenantId}/collateral-types/${id}`, { method: "DELETE", token });
}

export async function resendInvite(token: string, inviteId: string) {
  await apiFetch(`/invites/${inviteId}/resend`, { method: "POST", token });
}

export async function revokeInvite(token: string, inviteId: string) {
  await apiFetch(`/invites/${inviteId}`, { method: "DELETE", token });
}
