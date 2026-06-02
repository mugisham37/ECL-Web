"use client";

import { Camera, User, Lock, Shield } from "lucide-react";
import type { UserProfile } from "@/lib/settings-types";

interface ProfileSectionProps {
  profile: UserProfile;
  name: string;
  title: string;
  onNameChange: (v: string) => void;
  onTitleChange: (v: string) => void;
  onUploadClick: () => void;
}

export function ProfileSection({ profile, name, title, onNameChange, onTitleChange, onUploadClick }: ProfileSectionProps) {
  const initials = name.trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <section className="set-sec active" aria-labelledby="profile-sec-heading">
      <div className="set-card">
        <div className="set-card-head">
          <h3 id="profile-sec-heading">Profile</h3>
          <p>How you appear to your team across the workspace.</p>
        </div>
        <div className="set-card-body">
          {/* Avatar */}
          <div className="avatar-block">
            <span className="avatar-xl" aria-hidden>{initials}</span>
            <div className="avatar-actions">
              <button
                onClick={onUploadClick}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 32, padding: "0 12px", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", background: "var(--surface)", color: "var(--text)", fontSize: "var(--fs-caption)", fontWeight: "var(--fw-medium)", cursor: "pointer" }}
              >
                <Camera size={13} aria-hidden /> Upload photo
              </button>
              <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>PNG or JPG, up to 2 MB. Or keep your initials.</span>
            </div>
          </div>

          {/* Form grid */}
          <div className="set-grid">
            <div className="field">
              <label htmlFor="a-name" style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontWeight: "var(--fw-medium)" }}>Full name</label>
              <div className="input-wrap">
                <User size={15} className="ic" aria-hidden />
                <input id="a-name" className="input" value={name} onChange={(e) => onNameChange(e.target.value)} autoComplete="name" />
              </div>
            </div>

            <div className="field">
              <label htmlFor="a-title" style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontWeight: "var(--fw-medium)" }}>
                Job title <span style={{ color: "var(--text-subtle)", fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                id="a-title"
                className="input"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="e.g. Credit Risk Analyst"
              />
            </div>

            <div className="field readonly-field">
              <label htmlFor="a-email" className="field-locked-tag" style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontWeight: "var(--fw-medium)", display: "inline-flex", alignItems: "center", gap: 5 }}>
                Email <Lock size={12} style={{ color: "var(--text-subtle)" }} aria-hidden />
              </label>
              <input id="a-email" className="input" value={profile.email} readOnly style={{ background: "var(--surface-sunken)", color: "var(--text-muted)", cursor: "default" }} />
              <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-subtle)", marginTop: 4, display: "block" }}>Your sign-in identity. Contact your admin to change it.</span>
            </div>

            <div className="field readonly-field">
              <label className="field-locked-tag" style={{ fontSize: "var(--fs-caption)", color: "var(--text-muted)", fontWeight: "var(--fw-medium)", display: "inline-flex", alignItems: "center", gap: 5 }}>
                Role <Lock size={12} style={{ color: "var(--text-subtle)" }} aria-hidden />
              </label>
              <div style={{ height: "var(--control-h)", display: "flex", alignItems: "center" }}>
                <span className="role-badge role-admin">
                  <Shield size={13} aria-hidden /> {profile.role}
                </span>
              </div>
              <span style={{ fontSize: "var(--fs-caption)", color: "var(--text-subtle)", marginTop: 4, display: "block" }}>Managed by your tenant admin.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
