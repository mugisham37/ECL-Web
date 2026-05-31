"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { cn } from "@/src/lib/utils";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  autoComplete?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export function PasswordInput({
  id,
  name,
  label,
  autoComplete = "current-password",
  placeholder,
  value,
  onChange,
  disabled,
  className,
  error,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} style={{ fontWeight: 500, color: "var(--text)" }}>
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn("pr-10", error && "border-[var(--danger)]")}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center size-6 rounded transition-colors duration-120"
          style={{ color: "var(--text-subtle)" }}
          aria-label={show ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
