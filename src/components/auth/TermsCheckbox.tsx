"use client";

import { useState } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TermsCheckboxProps {
  onCheckedChange?: (checked: boolean) => void;
}

export function TermsCheckbox({ onCheckedChange }: TermsCheckboxProps) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-start gap-2">
      {checked ? <input type="hidden" name="terms" value="true" /> : null}
      <Checkbox
        id="terms"
        checked={checked}
        onCheckedChange={(v) => {
          const isChecked = v === true;
          setChecked(isChecked);
          onCheckedChange?.(isChecked);
        }}
        className="mt-0.5"
      />
      <Label
        htmlFor="terms"
        className="text-sm leading-relaxed cursor-pointer select-none"
        style={{ color: "var(--text-muted)", fontWeight: 400 }}
      >
        I agree to the{" "}
        <Link
          href="/terms"
          className="font-medium no-underline hover:underline"
          style={{ color: "var(--accent)" }}
          target="_blank"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="font-medium no-underline hover:underline"
          style={{ color: "var(--accent)" }}
          target="_blank"
        >
          Privacy Policy
        </Link>
      </Label>
    </div>
  );
}
