"use client";

import { Building2, Globe, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { CURRENCIES, TIMEZONES } from "@/lib/onboarding-schema";

export function ProfileStep() {
  const { state, dispatch } = useWizard();
  const { profile } = state;

  function set(patch: Partial<typeof profile>) {
    dispatch({ type: "SET_PROFILE", patch });
  }

  return (
    <div>
      <p
        className="text-xs uppercase tracking-widest font-medium mb-2"
        style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
      >
        Step 1 of 5
      </p>
      <h2 className="font-semibold" style={{ fontSize: "var(--fs-h1)", letterSpacing: "-0.01em", color: "var(--text)" }}>
        Tenant profile
      </h2>
      <p className="mt-2" style={{ color: "var(--text-muted)", lineHeight: 1.55 }}>
        These define how figures are displayed and scheduled across the workspace.
      </p>

      {/* 2-column grid */}
      <div className="grid gap-4 mt-7 profile-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Institution name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="t-name" style={{ fontWeight: 500, color: "var(--text)" }}>
            Institution name
          </Label>
          <div className="relative">
            <Building2
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
              style={{ color: "var(--text-subtle)" }}
            />
            <Input
              id="t-name"
              name="institutionName"
              className="pl-9"
              placeholder="Savanna Bank PLC"
              value={profile.institutionName}
              onChange={(e) => set({ institutionName: e.target.value })}
              autoComplete="organization"
            />
          </div>
        </div>

        {/* Currency */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="t-cur" style={{ fontWeight: 500, color: "var(--text)" }}>
            Primary currency
          </Label>
          <select
            id="t-cur"
            className="h-9 w-full rounded-md px-3 text-sm"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            value={profile.currency}
            onChange={(e) => set({ currency: e.target.value })}
          >
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            Cannot be changed after setup.
          </p>
        </div>

        {/* Timezone */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="t-tz" style={{ fontWeight: 500, color: "var(--text)" }}>
            Time zone
          </Label>
          <div className="relative">
            <Globe
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
              style={{ color: "var(--text-subtle)" }}
            />
            <select
              id="t-tz"
              className="h-9 w-full rounded-md text-sm pl-9 pr-3"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
              value={profile.timezone}
              onChange={(e) => set({ timezone: e.target.value })}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cadence */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="t-cad" style={{ fontWeight: 500, color: "var(--text)" }}>
            Reporting cadence
          </Label>
          <select
            id="t-cad"
            className="h-9 w-full rounded-md px-3 text-sm"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            value={profile.cadence}
            onChange={(e) => set({ cadence: e.target.value as "Monthly" | "Quarterly" })}
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
          </select>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            When ECL runs are expected. Used for reminders only.
          </p>
        </div>
      </div>

      {/* Lock notice callout */}
      <div
        className="flex gap-3 mt-6 p-4 rounded-md"
        style={{ background: "var(--accent-subtle)", border: "1px solid var(--accent-border)" }}
      >
        <Info className="size-4 flex-none mt-0.5" style={{ color: "var(--accent)" }} />
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Currency and time zone are baked into stored runs for audit consistency,
          so they&apos;re locked once setup completes.
        </p>
      </div>

      <style>{`
        @media (max-width: 640px) { .profile-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
