"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Ban, CheckCircle, Trash2 } from "lucide-react";
import type { AdminSegment } from "@/lib/admin-types";

interface SegmentRowProps {
  segment: AdminSegment;
  onChange: (field: keyof AdminSegment, value: string) => void;
  onToggleDisable: () => void;
  onDelete: () => void;
}

export function SegmentRow({ segment, onChange, onToggleDisable, onDelete }: SegmentRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <tr style={{ opacity: segment.disabled ? 0.55 : 1 }}>
      <td>
        <input
          className="cell-input admin-editable"
          value={segment.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Segment name"
          style={{ maxWidth: 240 }}
          aria-label="Segment name"
        />
      </td>
      <td>
        <input
          className="cell-input admin-editable"
          value={segment.code}
          onChange={(e) => onChange("code", e.target.value.toUpperCase())}
          placeholder="CODE"
          style={{ width: 90, textTransform: "uppercase" }}
          maxLength={6}
          aria-label="Segment code"
        />
      </td>
      <td className="num">
        <span className="usage-chip">
          {segment.runsCount > 0 ? `${segment.runsCount} runs` : "unused"}
        </span>
      </td>
      <td>
        {segment.disabled
          ? <span className="pill pill-muted"><span className="dot" />Disabled</span>
          : <span className="pill pill-success"><span className="dot" />Active</span>
        }
      </td>
      <td>
        <div className="row-pop-wrap" style={{ justifyContent: "flex-end" }} ref={menuRef}>
          <button
            className="row-menu-btn admin-editable"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={`Actions for ${segment.name}`}
          >
            <MoreVertical size={14} aria-hidden />
          </button>
          {menuOpen && (
            <div className="row-pop" role="menu">
              <button role="menuitem" onClick={() => { setMenuOpen(false); onToggleDisable(); }}>
                {segment.disabled
                  ? <><CheckCircle size={14} className="ic" aria-hidden /> Enable for new runs</>
                  : <><Ban size={14} className="ic" aria-hidden /> Disable for new runs</>
                }
              </button>
              <div className="rp-sep" />
              <button role="menuitem" className="danger" onClick={() => { setMenuOpen(false); onDelete(); }}>
                <Trash2 size={14} className="ic" aria-hidden /> Delete segment
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
