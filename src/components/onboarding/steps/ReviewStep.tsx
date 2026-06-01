"use client";

import { Check, Mail, PenLine, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWizard } from "../WizardContext";

export function ReviewStep() {
  const { state, dispatch } = useWizard();
  const { profile, segments, collateral, invites } = state;

  const currencyLabel = profile.currency || "—";
  const tzShort = profile.timezone.split("/").pop()?.replace(/_/g, " ") ?? profile.timezone;

  function editStep(step: 0 | 1 | 2 | 3) {
    dispatch({ type: "GO_TO_STEP", step });
  }

  return (
    <div>
      <p
        className="text-xs uppercase tracking-widest font-medium mb-2"
        style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
      >
        Step 5 of 5
      </p>
      <h2 className="font-semibold" style={{ fontSize: "var(--fs-h1)", letterSpacing: "-0.01em", color: "var(--text)" }}>
        Review &amp; finish
      </h2>
      <p className="mt-2" style={{ color: "var(--text-muted)", lineHeight: 1.55 }}>
        Confirm everything below. You can still edit any section.
      </p>

      <div className="grid gap-6 mt-7 review-layout" style={{ gridTemplateColumns: "1fr 0.85fr" }}>
        {/* Left: review sections */}
        <div>
          {/* Profile */}
          <ReviewSection
            label="Tenant profile"
            onEdit={() => editStep(0)}
          >
            <p
              className="font-medium"
              style={{ fontFamily: "var(--font-mono)", fontSize: "1.05rem", color: "var(--text)" }}
            >
              {profile.institutionName || <span style={{ color: "var(--text-subtle)" }}>—</span>}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {currencyLabel} · {tzShort} · {profile.cadence}
            </p>
          </ReviewSection>

          {/* Segments */}
          <ReviewSection
            label="Segments"
            onEdit={() => editStep(1)}
          >
            {segments.length === 0 ? (
              <span
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ background: "var(--warning-subtle)", color: "var(--warning)" }}
              >
                None — required
              </span>
            ) : (
              <>
                <div className="flex flex-wrap gap-1.5">
                  {segments.map((s) => (
                    <span
                      key={s.id}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ background: "var(--surface-sunken)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
                  {segments.length} segment{segments.length !== 1 ? "s" : ""}
                </p>
              </>
            )}
          </ReviewSection>

          {/* Collateral */}
          <ReviewSection
            label="Collateral & haircuts"
            onEdit={() => editStep(2)}
          >
            {collateral.length === 0 ? (
              <span
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ background: "var(--warning-subtle)", color: "var(--warning)" }}
              >
                None — required
              </span>
            ) : (
              <>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {collateral
                    .slice(0, 4)
                    .map((c) => `${c.name} (${c.haircut}%/${c.ttr}mo)`)
                    .join(" · ")}
                  {collateral.length > 4 && (
                    <span style={{ color: "var(--text-subtle)" }}>
                      {" "}+{collateral.length - 4} more
                    </span>
                  )}
                </p>
                <p className="text-xs mt-2" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
                  {collateral.length} type{collateral.length !== 1 ? "s" : ""}
                </p>
              </>
            )}
          </ReviewSection>

          {/* Team */}
          <ReviewSection
            label="Team invites"
            onEdit={() => editStep(3)}
            noBorder
          >
            {invites.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No invites — you can add team members later.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {invites.map((inv) => (
                  <span
                    key={inv.email}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ background: "var(--surface-sunken)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                  >
                    {inv.email} · {inv.role}
                  </span>
                ))}
              </div>
            )}
          </ReviewSection>
        </div>

        {/* Right: reassurance */}
        <div
          className="rounded-md p-5 self-start"
          style={{ background: "var(--accent-subtle)", border: "1px solid var(--accent-border)" }}
        >
          <h4 className="font-semibold mb-3" style={{ fontSize: "var(--fs-h3)", color: "var(--text)" }}>
            What happens next
          </h4>
          {[
            { icon: Check, text: "Your workspace opens, ready for its first run." },
            { icon: Mail, text: "Team invites are emailed immediately." },
            { icon: PenLine, text: "Segments and collateral stay editable in Admin." },
            { icon: Lock, text: "Currency and time zone lock for audit consistency." },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex gap-2.5 items-start mt-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
              <Icon className="size-3.5 flex-none mt-0.5" style={{ color: "var(--accent)" }} />
              {text}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) { .review-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function ReviewSection({
  label,
  onEdit,
  children,
  noBorder = false,
}: {
  label: string;
  onEdit: () => void;
  children: React.ReactNode;
  noBorder?: boolean;
}) {
  return (
    <div
      className="py-4"
      style={noBorder ? {} : { borderBottom: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs uppercase tracking-widest font-medium"
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "var(--tracking-caps)",
          }}
        >
          {label}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          style={{ color: "var(--accent)" }}
          onClick={onEdit}
        >
          Edit
        </Button>
      </div>
      {children}
    </div>
  );
}
