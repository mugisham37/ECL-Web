import { Check, AlertTriangle, X } from "lucide-react";
import type { ValidationResult } from "@/lib/new-run-types";

export function ValidationSummary({ result }: { result: ValidationResult }) {
  const isOk = result.status === "ok";
  const isWarn = result.status === "warn";

  const Icon = isOk ? Check : isWarn ? AlertTriangle : X;
  const cls = isOk ? "ok" : isWarn ? "warn" : "err";

  return (
    <div className={`val-summary ${cls}`}>
      <span className="vs-ic" aria-hidden="true">
        <Icon size={20} />
      </span>
      <div>
        <div className="vs-t">{result.summary}</div>
        <div className="vs-d">{result.subSummary}</div>
      </div>
    </div>
  );
}
