import { Check, Loader } from "lucide-react";
import { motion } from "framer-motion";
import type { ComputeStage } from "@/lib/new-run-types";

export function ComputeStageTracker({ stages }: { stages: ComputeStage[] }) {
  return (
    <div className="compute-tracker">
      {stages.map((stage, i) => {
        const isDone = stage.status === "done";
        const isActive = stage.status === "active";

        const marker = isDone ? (
          <Check size={13} />
        ) : isActive ? (
          <Loader size={13} style={{ animation: "spin 1s linear infinite" }} />
        ) : (
          <span>{i + 1}</span>
        );

        const statusBadge = isDone ? (
          <span className="pill pill-success" style={{ height: 20 }}>
            <Check size={11} />
            done {stage.elapsed ? `· ${stage.elapsed}` : ""}
          </span>
        ) : isActive ? (
          <span style={{ fontSize: "var(--fs-caption)", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
            running…
          </span>
        ) : null;

        return (
          <motion.div
            key={stage.id}
            className={`ctrack ${stage.status}`}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18, delay: i * 0.05 }}
          >
            <div className="cm" aria-hidden="true">{marker}</div>
            <div className="ct-body">
              <div className="ct-t">
                {stage.title}
                {statusBadge && <span>{statusBadge}</span>}
              </div>
              <div className="ct-d">{stage.description}</div>
              {isActive && (
                <div className="progress indeterminate ct-bar">
                  <div className="bar" />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
