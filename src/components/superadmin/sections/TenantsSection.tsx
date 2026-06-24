import { Search, Plus, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { SkeletonBlock } from "@/components/dashboard/shared/SkeletonBlock";
import { TenantNameCell } from "../atoms/TenantNameCell";
import { PlanTag } from "../atoms/PlanTag";
import { StatusPill } from "../atoms/StatusPill";
import type { TenantRecord, TenantStatus } from "@/lib/superadmin-types";

interface TenantsSectionProps {
  tenants: TenantRecord[];
  filteredTenants: TenantRecord[];
  search: string;
  statusFilter: TenantStatus | "all";
  onSearchChange: (v: string) => void;
  onStatusFilterChange: (v: TenantStatus | "all") => void;
  onRowClick: (idx: number) => void;
  onProvision: () => void;
  isLoading: boolean;
}

const STATUS_FILTERS: Array<{ label: string; value: TenantStatus | "all" }> = [
  { label: "All",       value: "all"       },
  { label: "Active",    value: "active"    },
  { label: "Trial",     value: "trial"     },
  { label: "Suspended", value: "suspended" },
];

export function TenantsSection({
  tenants,
  filteredTenants,
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onRowClick,
  onProvision,
  isLoading,
}: TenantsSectionProps) {
  if (isLoading) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <SkeletonBlock height={28} width={160} />
          <SkeletonBlock height={36} width={140} />
        </div>
        <div style={{ marginBottom: 12 }}><SkeletonBlock height={44} /></div>
        {[...Array(6)].map((_, i) => <SkeletonBlock key={i} height={52} className="skel-row" />)}
      </div>
    );
  }

  return (
    <div>
      {/* header */}
      <div className="sec-title-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--sp-4)", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: "var(--fw-semibold)" as string }}>Tenants</h2>
          <span className="badge">{tenants.length} tenants</span>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={onProvision}
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <Plus size={14} aria-hidden />
          Provision tenant
        </button>
      </div>

      {/* toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--sp-4)", flexWrap: "wrap" }}>
        <div className="input-wrap" style={{ maxWidth: 260, flex: 1 }}>
          <Search size={14} className="ic" aria-hidden />
          <input
            className="input"
            placeholder="Search tenants…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search tenants"
          />
        </div>
        <div className="seg" role="group" aria-label="Filter by status">
          {STATUS_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              aria-pressed={statusFilter === value}
              onClick={() => onStatusFilterChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="op-table-wrap admin-table-wrap">
        <table className="tbl runs-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Plan</th>
              <th>Status</th>
              <th className="num">Users</th>
              <th className="num">Runs (mo)</th>
              <th>Created</th>
              <th className="num">MRR</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredTenants.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)" }}>
                  {search || statusFilter !== "all"
                    ? "No tenants match your filters."
                    : "No tenants yet."}
                </td>
              </tr>
            ) : (
              filteredTenants.map((t, i) => {
                const originalIdx = tenants.indexOf(t);
                return (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.12, delay: i * 0.03 }}
                    onClick={() => onRowClick(originalIdx)}
                  >
                    <td>
                      <TenantNameCell mark={t.mark} color={t.color} name={t.name} />
                    </td>
                    <td><PlanTag plan={t.plan} /></td>
                    <td><StatusPill status={t.status} /></td>
                    <td className="num">{t.users}</td>
                    <td className="num">{t.runs}</td>
                    <td className="muted">{t.created}</td>
                    <td className="num mrr-cell">
                      {t.mrr ? `$${t.mrr.toLocaleString("en-US")}` : "—"}
                    </td>
                    <td className="num">
                      <ChevronRight size={14} style={{ color: "var(--text-subtle)" }} aria-hidden />
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* footer */}
      <div style={{ marginTop: 10, fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>
        {filteredTenants.length} of {tenants.length} tenants
      </div>
    </div>
  );
}
