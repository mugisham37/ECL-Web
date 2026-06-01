"use client";

import { Trash2, Plus, Layers } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TableEmptyState } from "../shared/TableEmptyState";
import { TableCellError } from "../shared/TableCellError";
import { useWizard } from "../WizardContext";
import { cn } from "@/lib/utils";

export function SegmentsStep() {
  const { state, dispatch } = useWizard();
  const { segments } = state;
  const hasSegments = segments.length > 0;

  // Duplicate detection
  const names = segments.map((s) => s.name.trim().toLowerCase());
  const dupeError = names.some((n, i) => n && names.indexOf(n) !== i)
    ? "Segment names must be unique."
    : undefined;

  return (
    <div>
      <p
        className="text-xs uppercase tracking-widest font-medium mb-2"
        style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
      >
        Step 2 of 5
      </p>
      <h2 className="font-semibold" style={{ fontSize: "var(--fs-h1)", letterSpacing: "-0.01em", color: "var(--text)" }}>
        Segments
      </h2>
      <p className="mt-2" style={{ color: "var(--text-muted)", lineHeight: 1.55 }}>
        The portfolios you compute ECL for. Each gets its own PD transition matrix.
        Add at least one — most banks start with the common set.
      </p>

      {!hasSegments ? (
        <TableEmptyState
          icon={Layers}
          heading="No segments yet"
          body="Start from the common set, or add your own."
          primaryLabel="Add common segments"
          secondaryLabel="Add one manually"
          onPrimary={() => dispatch({ type: "ADD_COMMON_SEGMENTS" })}
          onSecondary={() => dispatch({ type: "ADD_SEGMENT" })}
        />
      ) : (
        <div className="mt-6">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left pb-2 pr-2 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                  Segment name
                </th>
                <th
                  className="text-left pb-2 pr-2 text-xs font-semibold"
                  style={{ color: "var(--text-muted)", width: 160 }}
                >
                  Code{" "}
                  <span style={{ color: "var(--text-subtle)", fontWeight: 400 }}>(optional)</span>
                </th>
                <th style={{ width: 44 }} />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {segments.map((seg) => {
                  const isDupe =
                    seg.name.trim() &&
                    names.filter((n) => n === seg.name.trim().toLowerCase()).length > 1;

                  return (
                    <motion.tr
                      key={seg.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <td className="py-1.5 pr-2">
                        <input
                          className={cn(
                            "w-full h-9 rounded-sm px-2.5 text-sm transition-colors duration-120",
                            isDupe && "border-[var(--danger)]"
                          )}
                          style={{
                            background: "var(--surface)",
                            border: `1px solid ${isDupe ? "var(--danger)" : "var(--border)"}`,
                            color: "var(--text)",
                          }}
                          placeholder="Segment name"
                          value={seg.name}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_SEGMENT",
                              id: seg.id,
                              patch: { name: e.target.value },
                            })
                          }
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <input
                          className="w-full h-9 rounded-sm px-2.5 text-sm transition-colors duration-120"
                          style={{
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            color: "var(--text)",
                            fontFamily: "var(--font-mono)",
                          }}
                          placeholder="e.g. TRN"
                          value={seg.code ?? ""}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_SEGMENT",
                              id: seg.id,
                              patch: { code: e.target.value.toUpperCase() },
                            })
                          }
                        />
                      </td>
                      <td className="py-1.5">
                        <button
                          type="button"
                          className="size-8 rounded-sm flex items-center justify-center transition-colors duration-120"
                          style={{ color: "var(--text-subtle)", background: "none", border: "none", cursor: segments.length <= 1 ? "not-allowed" : "pointer", opacity: segments.length <= 1 ? 0.3 : 1 }}
                          disabled={segments.length <= 1}
                          onClick={() => dispatch({ type: "DELETE_SEGMENT", id: seg.id })}
                          onMouseEnter={(e) => { if (segments.length > 1) { (e.currentTarget as HTMLElement).style.color = "var(--danger)"; (e.currentTarget as HTMLElement).style.background = "var(--danger-subtle)"; } }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-subtle)"; (e.currentTarget as HTMLElement).style.background = "none"; }}
                          aria-label="Remove segment"
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

          <TableCellError message={dupeError} />

          <div className="flex items-center gap-2.5 mt-3.5">
            <Button
              variant="secondary"
              size="sm"
              className="gap-1"
              onClick={() => dispatch({ type: "ADD_SEGMENT" })}
            >
              <Plus className="size-3.5" /> Add segment
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: "ADD_COMMON_SEGMENTS" })}
            >
              Add common set
            </Button>
            <span
              className="ml-auto text-xs"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            >
              {segments.length} segment{segments.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
