export type MemberRole   = "Admin" | "Analyst" | "Reviewer";
export type MemberStatus = "active" | "invited" | "disabled";

export interface Member {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: MemberRole;
  status: MemberStatus;
  lastActive: string;
  isYou?: boolean;
}

export interface AdminSegment {
  id: string;
  name: string;
  code: string;
  runsCount: number;
  disabled: boolean;
}

export interface CollateralType {
  id: string;
  name: string;
  haircut: number;   // 0–100 %
  timeToRealize: number; // months
}

export interface TenantProfile {
  name: string;
  reportingCadence: "Monthly" | "Quarterly";
  currency: string;   // locked
  timezone: string;   // locked
}

export type AdminSection = "members" | "segments" | "collateral" | "profile";

export interface ToastItem {
  id: string;
  message: string;
  kind: "success" | "info" | "danger";
}

export type ModalKind =
  | { type: "invite" }
  | { type: "confirm-remove"; member: Member }
  | { type: "confirm-role"; member: Member; newRole: MemberRole; index: number }
  | { type: "segment-delete-guard"; segment: AdminSegment; index: number }
  | { type: "segment-delete-confirm"; segment: AdminSegment; index: number }
  | { type: "collateral-delete"; item: CollateralType; index: number }
  | { type: "close-tenant" }
  | null;
