import { MoreHorizontal } from "lucide-react";
import { SkeletonBlock } from "@/components/dashboard/shared/SkeletonBlock";
import type { PlatformUser } from "@/lib/superadmin-types";
import type { ToastItem } from "@/lib/admin-types";

interface UsersSectionProps {
  users: PlatformUser[];
  isLoading: boolean;
  onToast: (msg: string, kind?: ToastItem["kind"]) => void;
}

const ROLE_CLASS: Record<string, string> = {
  Admin:    "role-badge role-admin",
  Analyst:  "role-badge role-analyst",
  Reviewer: "role-badge role-reviewer",
};

export function UsersSection({ users, isLoading, onToast }: UsersSectionProps) {
  if (isLoading) {
    return (
      <div>
        <div style={{ marginBottom: 16 }}><SkeletonBlock height={28} width={100} /></div>
        {[...Array(6)].map((_, i) => <SkeletonBlock key={i} height={52} className="skel-row" />)}
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: "var(--fw-semibold)" as string, marginBottom: "var(--sp-4)" }}>
        Platform users
      </h2>

      <div className="admin-table-wrap">
        <table className="tbl" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>User</th>
              <th>Tenant</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => {
              const initials = u.name.split(" ").map((p) => p[0]).join("").slice(0, 2);
              return (
                <tr key={i}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className="avatar avatar-sm">{initials}</span>
                      <div>
                        <div style={{ fontWeight: "var(--fw-medium)" as string }}>{u.name}</div>
                        <div style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="muted">{u.tenant}</td>
                  <td><span className={ROLE_CLASS[u.role] ?? "role-badge"}>{u.role}</span></td>
                  <td>
                    {u.status === "active"
                      ? <span className="pill pill-success"><span className="dot" />Active</span>
                      : <span className="pill pill-muted"><span className="dot" />Disabled</span>}
                  </td>
                  <td className="muted t-caption">{u.lastActive}</td>
                  <td>
                    <button
                      className="row-menu-btn"
                      aria-label={`Actions for ${u.name}`}
                      onClick={() => onToast("User management coming soon.", "info")}
                    >
                      <MoreHorizontal size={14} aria-hidden />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
