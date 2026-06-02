"use client";

import { Check } from "lucide-react";
import type { ThemePref } from "@/lib/settings-types";

interface ThemePickerProps {
  value: ThemePref;
  onChange: (t: ThemePref) => void;
}

const OPTIONS: Array<{ id: ThemePref; label: string; cls: string }> = [
  { id: "light",  label: "Light",  cls: "light"  },
  { id: "dark",   label: "Dark",   cls: "dark"   },
  { id: "system", label: "System", cls: "system" },
];

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <div className="theme-picker" role="radiogroup" aria-label="Theme">
      {OPTIONS.map(({ id, label, cls }) => (
        <div
          key={id}
          className={`theme-opt ${cls}${value === id ? " active" : ""}`}
          onClick={() => onChange(id)}
          role="radio"
          aria-checked={value === id}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onChange(id)}
        >
          <div className="swatch">
            <span className="mini-side" />
            <span className="mini-bar" />
            <span className="mini-card" />
          </div>
          <div className="to-label">
            {label}
            <Check size={14} className="ic" aria-hidden />
          </div>
        </div>
      ))}
    </div>
  );
}
