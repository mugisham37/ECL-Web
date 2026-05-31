"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoModal({ open, onOpenChange }: DemoModalProps) {
  const [view, setView] = useState<"form" | "success">("form");

  function handleClose(val: boolean) {
    onOpenChange(val);
    if (!val) {
      setTimeout(() => setView("form"), 300);
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

            <form
              className="px-6 pb-6 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setView("success");
              }}
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="d-name">Full name</Label>
                  <Input id="d-name" placeholder="Jane Mwangi" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="d-company">Company</Label>
                  <Input id="d-company" placeholder="Savanna Bank" required />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="d-email">Work email</Label>
                <Input
                  id="d-email"
                  type="email"
                  placeholder="jane@savannabank.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="d-role">Your role</Label>
                  <Select required>
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
                  <Select required>
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
                />
              </div>

              <Button type="submit" size="lg" className="w-full mt-1">
                Request a demo
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
