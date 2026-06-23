"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  name: string;
  company: string;
  email: string;
  role: string;
  portfolioSize: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  company: "",
  email: "",
  role: "",
  portfolioSize: "",
  message: "",
};

export function DemoModal({ open, onOpenChange }: DemoModalProps) {
  const [view, setView] = useState<"form" | "success">("form");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleClose(val: boolean) {
    onOpenChange(val);
    if (!val) {
      setTimeout(() => {
        setView("form");
        setForm(EMPTY_FORM);
        setError(null);
      }, 300);
    }
  }

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Something went wrong. Please try again.");
      }

      setView("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[480px] gap-0 p-0 overflow-hidden bg-[var(--surface)] border-[var(--border)]">
        {view === "form" ? (
          <>
            <DialogHeader className="px-6 pt-6 pb-4">
              <DialogTitle className="text-lg font-semibold text-[var(--text)]">
                Request a demo
              </DialogTitle>
              <DialogDescription className="text-sm text-[var(--text-muted)]">
                See your own portfolio&apos;s ECL in a 30-minute walkthrough.
              </DialogDescription>
            </DialogHeader>

            <form className="px-6 pb-6 flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="d-name">Full name</Label>
                  <Input
                    id="d-name"
                    placeholder="Jane Mwangi"
                    required
                    value={form.name}
                    onChange={set("name")}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="d-company">Company</Label>
                  <Input
                    id="d-company"
                    placeholder="Savanna Bank"
                    required
                    value={form.company}
                    onChange={set("company")}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="d-email">Work email</Label>
                <Input
                  id="d-email"
                  type="email"
                  placeholder="jane@savannabank.com"
                  required
                  value={form.email}
                  onChange={set("email")}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="d-role">Your role</Label>
                  <Select
                    required
                    value={form.role}
                    onValueChange={(v) => setForm((prev) => ({ ...prev, role: v }))}
                  >
                    <SelectTrigger id="d-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cro">CRO / Risk Head</SelectItem>
                      <SelectItem value="analyst">Risk Analyst</SelectItem>
                      <SelectItem value="finance">CFO / Finance</SelectItem>
                      <SelectItem value="it">IT / Tech</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="d-size">Portfolio size</Label>
                  <Select
                    required
                    value={form.portfolioSize}
                    onValueChange={(v) => setForm((prev) => ({ ...prev, portfolioSize: v }))}
                  >
                    <SelectTrigger id="d-size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lt1b">Under KES 1B</SelectItem>
                      <SelectItem value="1b5b">KES 1B – 5B</SelectItem>
                      <SelectItem value="5b20b">KES 5B – 20B</SelectItem>
                      <SelectItem value="gt20b">Over KES 20B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="d-message">
                  Anything you&apos;d like us to know{" "}
                  <span className="text-[var(--text-subtle)]">(optional)</span>
                </Label>
                <Textarea
                  id="d-message"
                  placeholder="Current pain points, timeline, etc."
                  rows={3}
                  value={form.message}
                  onChange={set("message")}
                />
              </div>

              {error && (
                <p className="text-sm text-[var(--destructive)]">{error}</p>
              )}

              <Button type="submit" size="lg" className="w-full mt-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Request a demo"
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="px-6 py-12 flex flex-col items-center gap-4 text-center">
            <div className="size-12 rounded-full bg-[var(--success-subtle)] flex items-center justify-center">
              <CheckCircle className="size-6 text-[var(--success)]" />
            </div>
            <div>
              <p className="text-base font-semibold text-[var(--text)]">
                Thanks — we&apos;ll be in touch!
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1 max-w-[300px]">
                Expect a response within one business day to schedule your
                walkthrough.
              </p>
            </div>
            <Button
              variant="secondary"
              className="mt-2"
              onClick={() => handleClose(false)}
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
