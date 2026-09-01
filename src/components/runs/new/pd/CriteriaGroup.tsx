"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronDown, ClipboardCheck } from "lucide-react";

interface CriteriaGroupProps {
  title: string;
  subtitle: string;
  countLabel: string;
  countClassName: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CriteriaGroup({
  title,
  subtitle,
  countLabel,
  countClassName,
  defaultOpen = false,
  children,
}: CriteriaGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const groupId = `crit-${title.replace(/\s+/g, "-").toLowerCase()}`;

  function toggle() {
    setOpen((v) => !v);
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }

  return (
    <div className={`crit-group${open ? " open" : ""}`}>
      <button
        type="button"
        className="crit-group-head"
        onClick={toggle}
        onKeyDown={onKeyDown}
        aria-expanded={open}
        aria-controls={groupId}
      >
        <span className="cg-ic" aria-hidden="true">
          <ClipboardCheck size={14} />
        </span>
        <div>
          <div className="cg-title">{title}</div>
          <div className="cg-sub mono">{subtitle}</div>
        </div>
        <span className={`cg-count pill ${countClassName}`}>
          <span className="dot" />
          {countLabel}
        </span>
        <ChevronDown size={15} className="cg-chev" aria-hidden="true" />
      </button>
      <div className="crit-body" id={groupId}>
        {children}
      </div>
    </div>
  );
}
