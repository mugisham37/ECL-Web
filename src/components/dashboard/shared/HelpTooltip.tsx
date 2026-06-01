"use client";

import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HelpTooltip({ text }: { text: string }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={text}
            style={{
              display: "inline-flex",
              background: "none",
              border: 0,
              padding: 0,
              cursor: "help",
              color: "var(--text-subtle)",
            }}
          >
            <HelpCircle size={12} />
          </button>
        </TooltipTrigger>
        <TooltipContent
          style={{
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            fontSize: "var(--fs-caption)",
            maxWidth: 220,
            boxShadow: "var(--shadow-pop)",
          }}
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
