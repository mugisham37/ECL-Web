"use client";

import { Trash2 } from "lucide-react";
import type { CollateralType } from "@/lib/admin-types";

interface CollateralRowProps {
  item: CollateralType;
  errors: { haircut?: boolean; ttr?: boolean };
  onChange: (field: keyof CollateralType, value: string | number) => void;
  onDelete: () => void;
}

export function CollateralRow({ item, errors, onChange, onDelete }: CollateralRowProps) {
  return (
    <tr>
      <td style={{ paddingLeft: 16 }}>
        <input
          className="cell-input admin-editable"
          value={item.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Collateral type"
          style={{ maxWidth: 260 }}
          aria-label="Collateral name"
        />
      </td>
      <td>
        <div className="cell-suffix" style={{ maxWidth: 120 }}>
          <input
            className={`cell-input admin-editable cell-num${errors.haircut ? " is-error" : ""}`}
            value={item.haircut}
            onChange={(e) => onChange("haircut", e.target.value)}
            inputMode="decimal"
            style={{ width: "100%" }}
            aria-label="Haircut percentage"
          />
          <span className="sfx">%</span>
        </div>
      </td>
      <td>
        <div className="cell-suffix" style={{ maxWidth: 130 }}>
          <input
            className={`cell-input admin-editable cell-num${errors.ttr ? " is-error" : ""}`}
            value={item.timeToRealize}
            onChange={(e) => onChange("timeToRealize", e.target.value)}
            inputMode="numeric"
            style={{ width: "100%" }}
            aria-label="Time to realize in months"
          />
          <span className="sfx">mo</span>
        </div>
      </td>
      <td>
        <button
          className="row-del admin-editable"
          onClick={onDelete}
          aria-label={`Delete ${item.name}`}
        >
          <Trash2 size={14} aria-hidden />
        </button>
      </td>
    </tr>
  );
}
