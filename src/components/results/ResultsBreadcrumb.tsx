import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { DrillLevel } from "@/lib/results-types";

interface ResultsBreadcrumbProps {
  level: DrillLevel;
  curSeg: string;
  curLoan: string;
  onDrill: (level: DrillLevel) => void;
}

export function ResultsBreadcrumb({ level, curSeg, curLoan, onDrill }: ResultsBreadcrumbProps) {
  const showSeg  = level === "segment" || level === "loan" || level === "empty";
  const showLoan = level === "loan";

  return (
    <nav className="rx-crumb" aria-label="Breadcrumb">
      <button
        className={level === "portfolio" ? "current" : ""}
        onClick={() => onDrill("portfolio")}
        aria-current={level === "portfolio" ? "page" : undefined}
      >
        All segments
      </button>

      <AnimatePresence>
        {showSeg && (
          <motion.span
            key="seg-crumb"
            style={{ display: "contents" }}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="rx-sep" aria-hidden>
              <ChevronRight size={14} />
            </span>
            <button
              className={level === "segment" || level === "empty" ? "current" : ""}
              onClick={() => onDrill("segment")}
              aria-current={level === "segment" ? "page" : undefined}
            >
              {curSeg}
            </button>
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLoan && (
          <motion.span
            key="loan-crumb"
            style={{ display: "contents" }}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="rx-sep" aria-hidden>
              <ChevronRight size={14} />
            </span>
            <button
              className="current"
              aria-current="page"
            >
              Loan {curLoan}
            </button>
          </motion.span>
        )}
      </AnimatePresence>
    </nav>
  );
}
