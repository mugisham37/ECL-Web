"use client";

import { useState } from "react";
import { Plus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { InviteRow } from "../shared/InviteRow";
import { InviteChip } from "../shared/InviteChip";
import { useWizard } from "../WizardContext";
import type { InviteEntry } from "@/lib/onboarding-schema";
import { AnimatePresence, motion } from "framer-motion";

const EMAIL_RE = /[^\s,;]+@[^\s,;]+\.[^\s,;]+/g;

export function TeamStep() {
  const { state, dispatch } = useWizard();
  const { invites } = state;
  const [rows, setRows] = useState<string[]>(["row-0"]);
  const [bulkText, setBulkText] = useState("");

  function addRow() {
    setRows((prev) => [...prev, `row-${Date.now()}`]);
  }

  function removeRow(key: string) {
    setRows((prev) => prev.filter((k) => k !== key));
    if (rows.length <= 1) setRows(["row-0"]);
  }

  function commitInvite(entry: InviteEntry) {
    dispatch({ type: "ADD_INVITE", entry });
  }

  function handleBulkAdd() {
    const found = bulkText.match(EMAIL_RE) ?? [];
    found.forEach((email) => {
      dispatch({ type: "ADD_INVITE", entry: { email, role: "Analyst" } });
    });
    setBulkText("");
  }

  return (
    <div>
      <p
        className="text-xs uppercase tracking-widest font-medium mb-2"
        style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
      >
        Step 4 of 5 · optional
      </p>
      <h2 className="font-semibold" style={{ fontSize: "var(--fs-h1)", letterSpacing: "-0.01em", color: "var(--text)" }}>
        Invite your team
      </h2>
      <p className="mt-2" style={{ color: "var(--text-muted)", lineHeight: 1.55 }}>
        Add analysts who upload files and run ECLs, and reviewers who read results.
        You can always invite more later from Admin.
      </p>

      <div className="mt-6">
        {/* Invite rows */}
        <AnimatePresence>
          {rows.map((key) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
            >
              <InviteRow
                onCommit={commitInvite}
                onRemove={() => removeRow(key)}
                showRemove={rows.length > 1}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1 mt-1"
          onClick={addRow}
        >
          <Plus className="size-3.5" /> Add another
        </Button>

        {/* Bulk add */}
        <details className="mt-5">
          <summary
            className="text-xs cursor-pointer font-medium"
            style={{ color: "var(--accent)" }}
          >
            Or paste a list of emails
          </summary>
          <div className="mt-3 flex flex-col gap-2">
            <Textarea
              rows={3}
              placeholder="a.karanja@savannabank.co.ke, j.otieno@savannabank.co.ke, …"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
            />
            <Button
              variant="secondary"
              size="sm"
              className="self-start"
              onClick={handleBulkAdd}
              disabled={!bulkText.trim()}
            >
              Add these as analysts
            </Button>
          </div>
        </details>

        {/* Committed invite chips */}
        {invites.length > 0 && (
          <div className="flex flex-col gap-2 mt-5">
            <AnimatePresence>
              {invites.map((inv) => (
                <motion.div
                  key={inv.email}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <InviteChip
                    invite={inv}
                    onRemove={() => dispatch({ type: "DELETE_INVITE", email: inv.email })}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Info callout */}
        <div
          className="flex gap-3 mt-6 p-4 rounded-md"
          style={{ background: "var(--accent-subtle)", border: "1px solid var(--accent-border)" }}
        >
          <Mail className="size-4 flex-none mt-0.5" style={{ color: "var(--accent)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Invites are sent when you finish setup. Each person gets a link that
            expires in 1 hour and sets their own password.
          </p>
        </div>
      </div>
    </div>
  );
}
