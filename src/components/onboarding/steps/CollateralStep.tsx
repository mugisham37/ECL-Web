"use client";

import { Trash2, Plus, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TableEmptyState } from "../shared/TableEmptyState";
import { TableCellError } from "../shared/TableCellError";
import { useWizard } from "../WizardContext";
import { cn } from "@/lib/utils";
import type { CollateralItem } from "@/lib/onboarding-schema";

function SuffixInput({
  value,
  suffix,
  onChange,
  isError,
  inputMode = "decimal",
}: {
  value: number | string;
  suffix: string;
  onChange: (v: number) => void;
  isError?: boolean;
  inputMode?: "decimal" | "numeric";
}) {
  return (
    <div className="relative">
      <input
        className={cn("w-full h-9 rounded-sm px-2.5 pr-7 text-sm transition-colors duration-120")}
        style={{
          background: "var(--surface)",
          border: `1px solid ${isError ? "var(--danger)" : "var(--border)"}`,
          color: "var(--text)",
          fontFamily: "var(--font-mono)",
        }}
        inputMode={inputMode}
        value={value}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          onChange(isNaN(n) ? 0 : n);
        }}
      />
      <span
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
        style={{ color: "var(--text-subtle)" }}
      >
        {suffix}
      </span>
    </div>
  );
}

export function CollateralStep() {
  const { state, dispatch } = useWizard();
  const { collateral } = state;
  const hasItems = collateral.length > 0;

  // Validation
  const haircutErrors = collateral
    .map((c) => isNaN(c.haircut) || c.haircut < 0 || c.haircut > 100)
    .some(Boolean);
  const ttrErrors = collateral
    .map((c) => isNaN(c.ttr) || c.ttr < 0)
    .some(Boolean);
  const names = collateral.map((c) => c.name.trim().toLowerCase());
  const hasDupes = names.some((n, i) => n && names.indexOf(n) !== i);

  const errorMsg = hasDupes
    ? "Collateral names must be unique."
    : haircutErrors || ttrErrors
    ? "Haircut must be 0–100%; time to realize must be 0 or more."
    : undefined;

  function update(id: string, patch: Partial<Omit<CollateralItem, "id">>) {
    dispatch({ type: "UPDATE_COLLATERAL", id, patch });
  }

  return (
    <div>
      <p
        className="text-xs uppercase tracking-widest font-medium mb-2"
        style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
      >
        Step 3 of 5
      </p>
      <h2 className="font-semibold" style={{ fontSize: "var(--fs-h1)", letterSpacing: "-0.01em", color: "var(--text)" }}>
        Collateral &amp; haircuts
      </h2>
      <p className="mt-2" style={{ color: "var(--text-muted)", lineHeight: 1.55 }}>
        The LGD engine discounts each collateral type by its haircut and time to
        realization. Defaults below are conservative — adjust to your recovery
        experience.
      </p>

      {!hasItems ? (
        <TableEmptyState
          icon={ShieldCheck}
          heading="No collateral types yet"
          body="Load the common types with conservative defaults, then adjust."
          primaryLabel="Add common types"
          secondaryLabel="Add one manually"
          onPrimary={() => dispatch({ type: "ADD_COMMON_COLLATERAL" })}
          onSecondary={() => dispatch({ type: "ADD_COLLATERAL" })}
        />
      ) : (
        <div className="mt-6">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left pb-2 pr-2 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                  Collateral type
                </th>
                <th className="text-left pb-2 pr-2 text-xs font-semibold" style={{ color: "var(--text-muted)", width: 130 }}>
                  Haircut
                </th>
                <th className="text-left pb-2 pr-2 text-xs font-semibold" style={{ color: "var(--text-muted)", width: 150 }}>
                  Time to realize
                </th>
                <th style={{ width: 44 }} />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {collateral.map((item) => {
                  const isDupe =
                    item.name.trim() &&
                    names.filter((n) => n === item.name.trim().toLowerCase()).length > 1;
                  const hcErr =
                    item.haircut !== undefined &&
                    (item.haircut < 0 || item.haircut > 100);
                  const ttrErr = item.ttr !== undefined && item.ttr < 0;

                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <td className="py-1.5 pr-2">
                        <input
                          className="w-full h-9 rounded-sm px-2.5 text-sm transition-colors duration-120"
                          style={{
                            background: "var(--surface)",
                            border: `1px solid ${isDupe ? "var(--danger)" : "var(--border)"}`,
                            color: "var(--text)",
                          }}
                          placeholder="Collateral type"
                          value={item.name}
                          onChange={(e) => update(item.id, { name: e.target.value })}
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <SuffixInput
                          value={item.haircut}
                          suffix="%"
                          isError={hcErr}
                          onChange={(v) => update(item.id, { haircut: v })}
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <SuffixInput
                          value={item.ttr}
                          suffix="mo"
                          inputMode="numeric"
                          isError={ttrErr}
                          onChange={(v) => update(item.id, { ttr: v })}
                        />
                      </td>
                      <td className="py-1.5">
                        <button
                          type="button"
                          className="size-8 rounded-sm flex items-center justify-center transition-colors duration-120"
                          style={{ color: "var(--text-subtle)", background: "none", border: "none", cursor: collateral.length <= 1 ? "not-allowed" : "pointer", opacity: collateral.length <= 1 ? 0.3 : 1 }}
                          disabled={collateral.length <= 1}
                          onClick={() => dispatch({ type: "DELETE_COLLATERAL", id: item.id })}
                          onMouseEnter={(e) => { if (collateral.length > 1) { (e.currentTarget as HTMLElement).style.color = "var(--danger)"; (e.currentTarget as HTMLElement).style.background = "var(--danger-subtle)"; } }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-subtle)"; (e.currentTarget as HTMLElement).style.background = "none"; }}
                          aria-label="Remove collateral type"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>

          <TableCellError message={errorMsg} />

          <div className="flex items-center gap-2.5 mt-3.5">
            <Button
              variant="secondary"
              size="sm"
              className="gap-1"
              onClick={() => dispatch({ type: "ADD_COLLATERAL" })}
            >
              <Plus className="size-3.5" /> Add type
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: "ADD_COMMON_COLLATERAL" })}
            >
              Add common set
            </Button>
            <span
              className="ml-auto text-xs"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            >
              {collateral.length} type{collateral.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
