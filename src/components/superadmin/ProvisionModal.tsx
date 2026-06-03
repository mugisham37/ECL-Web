"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { TenantPlan } from "@/lib/superadmin-types";

interface ProvisionData {
  name: string;
  plan: TenantPlan;
  region: string;
  email: string;
  trial: boolean;
}

interface ProvisionModalProps {
  open: boolean;
  onClose: () => void;
  onProvision: (data: ProvisionData) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProvisionModal({ open, onClose, onProvision }: ProvisionModalProps) {
  const [name,   setName]   = useState("");
  const [plan,   setPlan]   = useState<TenantPlan>("Growth");
  const [region, setRegion] = useState("af-east-1 (Nairobi)");
  const [email,  setEmail]  = useState("");
  const [trial,  setTrial]  = useState(true);
  const [nameErr,  setNameErr]  = useState("");
  const [emailErr, setEmailErr] = useState("");

  function handleSubmit() {
    let ok = true;
    if (!name.trim()) { setNameErr("Institution name is required."); ok = false; } else setNameErr("");
    if (!EMAIL_RE.test(email)) { setEmailErr("Enter a valid email address."); ok = false; } else setEmailErr("");
    if (!ok) return;

    onProvision({ name: name.trim(), plan, region, email: email.trim(), trial });
    // reset
    setName(""); setPlan("Growth"); setRegion("af-east-1 (Nairobi)"); setEmail(""); setTrial(true);
    setNameErr(""); setEmailErr("");
  }

  function handleClose() {
    setNameErr(""); setEmailErr("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          style={{
            position: "fixed", inset: 0, background: "var(--scrim)",
            zIndex: 82, display: "flex", alignItems: "center",
            justifyContent: "center", padding: 20,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="provision-modal-title"
        >
          <motion.div
            style={{
              background: "var(--surface-raised)", border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)", padding: "clamp(20px,3vw,28px)",
              maxWidth: 480, width: "100%", boxShadow: "var(--shadow-modal)",
            }}
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <h3 id="provision-modal-title" style={{ fontSize: "var(--fs-h2)", fontWeight: "var(--fw-semibold)" as string }}>
                Provision a new tenant
              </h3>
              <button
                onClick={handleClose}
                style={{ width: 28, height: 28, border: 0, background: "none", color: "var(--text-subtle)", display: "grid", placeItems: "center", borderRadius: "var(--r-sm)", cursor: "pointer" }}
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-body)", marginBottom: 18 }}>
              Creates an isolated workspace and emails the first admin a setup link.
            </p>

            {/* form fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Institution name */}
              <div className="field">
                <label htmlFor="pvName">Institution name</label>
                <input
                  className={`input${nameErr ? " input-error" : ""}`}
                  id="pvName"
                  placeholder="e.g. Coastline Bank"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (nameErr) setNameErr(""); }}
                  autoComplete="off"
                />
                {nameErr && <div className="field-err">{nameErr}</div>}
              </div>

              {/* Plan + Region row */}
              <div style={{ display: "flex", gap: 12 }}>
                <div className="field" style={{ flex: 1 }}>
                  <label htmlFor="pvPlan">Plan</label>
                  <select
                    className="select"
                    id="pvPlan"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as TenantPlan)}
                  >
                    <option>Starter</option>
                    <option>Growth</option>
                    <option>Enterprise</option>
                  </select>
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label htmlFor="pvRegion">Region</label>
                  <select
                    className="select"
                    id="pvRegion"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  >
                    <option>af-east-1 (Nairobi)</option>
                    <option>af-west-1 (Lagos)</option>
                    <option>eu-west-1 (Dublin)</option>
                  </select>
                </div>
              </div>

              {/* Admin email */}
              <div className="field">
                <label htmlFor="pvEmail">First admin email</label>
                <input
                  className={`input${emailErr ? " input-error" : ""}`}
                  id="pvEmail"
                  type="email"
                  placeholder="admin@bank.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailErr) setEmailErr(""); }}
                  autoComplete="off"
                />
                {emailErr && <div className="field-err">{emailErr}</div>}
              </div>

              {/* Trial checkbox */}
              <label className="check" style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={trial}
                  onChange={(e) => setTrial(e.target.checked)}
                />
                <span style={{ fontSize: "var(--fs-body)", color: "var(--text-muted)" }}>
                  Start with a 14-day trial
                </span>
              </label>
            </div>

            {/* actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={handleClose}
                style={{
                  flex: 1, height: "var(--control-h)", border: "1px solid var(--border-strong)",
                  borderRadius: "var(--r-sm)", background: "var(--surface)", color: "var(--text)",
                  fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)" as string, cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 1, height: "var(--control-h)", border: "none",
                  borderRadius: "var(--r-sm)", background: "var(--accent)", color: "#fff",
                  fontSize: "var(--fs-body)", fontWeight: "var(--fw-medium)" as string, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                Provision
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
