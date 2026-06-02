"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ResultsHeader } from "./ResultsHeader";
import { ResultsBreadcrumb } from "./ResultsBreadcrumb";
import { ResultsToolbar } from "./ResultsToolbar";
import { PortfolioView } from "./portfolio/PortfolioView";
import { SegmentView } from "./segment/SegmentView";
import { LoanView } from "./loan/LoanView";
import { ResultsEmptyState } from "./shared/ResultsEmptyState";
import {
  MOCK_RUN_CONTEXT,
  MOCK_SEGMENTS,
  getLoanDetail,
} from "@/lib/results-mock";
import { defaultFilter } from "@/lib/results-types";
import type { DrillLevel, ExplorerFilter } from "@/lib/results-types";
import { fmtKes } from "@/lib/results-mock";

const FADE_VARIANTS = {
  hidden:  { opacity: 0, y: 4  },
  visible: { opacity: 1, y: 0  },
  exit:    { opacity: 0, y: -4 },
};

export function ResultsExplorer() {
  const [level,   setLevel]   = useState<DrillLevel>("portfolio");
  const [curSeg,  setCurSeg]  = useState("Transport");
  const [curLoan, setCurLoan] = useState("TRN-04821");
  const [filter,  setFilter]  = useState<ExplorerFilter>(defaultFilter);
  const [density, setDensity] = useState<"compact" | "comfortable">("compact");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data fetch
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // Apply data-density attribute so table cells pick up CSS token
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    wrapRef.current?.setAttribute("data-density", density);
  }, [density]);

  function drill(lvl: DrillLevel) {
    setLevel(lvl);
    // Reset search when drilling back up
    if (lvl === "portfolio" || lvl === "segment") {
      setFilter((f) => ({ ...f, search: "" }));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function drillSegment(name: string) {
    setCurSeg(name);
    drill("segment");
  }

  function drillLoan(id: string) {
    setCurLoan(id);
    drill("loan");
  }

  function clearFilters() {
    setFilter(defaultFilter);
    if (level === "empty") drill("segment");
  }

  function handleFilterChange(patch: Partial<ExplorerFilter>) {
    setFilter((prev) => {
      const next = { ...prev, ...patch };
      // Auto-switch to empty when all stages deselected or search yields nothing
      // (SegmentLoansTable handles the visual; here we just track state)
      return next;
    });
  }

  // Derived: row summary string
  const rowSummary = useMemo(() => {
    if (level === "portfolio") {
      const totalEcl = MOCK_SEGMENTS.reduce((a, s) => a + s.ecl, 0);
      return `${MOCK_SEGMENTS.length} segments · KES ${fmtKes(totalEcl)}`;
    }
    if (level === "segment") {
      const seg = MOCK_SEGMENTS.find((s) => s.name === curSeg) ?? MOCK_SEGMENTS[0];
      return `${seg.loans.toLocaleString()} loans · KES ${fmtKes(seg.ecl)}`;
    }
    if (level === "loan") return `Loan ${curLoan}`;
    return "0 results";
  }, [level, curSeg, curLoan]);

  const currentSeg  = MOCK_SEGMENTS.find((s) => s.name === curSeg) ?? MOCK_SEGMENTS[0];
  const currentLoan = getLoanDetail(curLoan, curSeg);

  const showToolbar = level !== "loan";

  return (
    <div ref={wrapRef} data-density={density}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Run context header */}
        <ResultsHeader
          runContext={MOCK_RUN_CONTEXT}
          density={density}
          onDensityToggle={() =>
            setDensity((d) => (d === "compact" ? "comfortable" : "compact"))
          }
        />

        {/* Breadcrumb */}
        <ResultsBreadcrumb
          level={level}
          curSeg={curSeg}
          curLoan={curLoan}
          onDrill={drill}
        />

        {/* Filter toolbar */}
        <ResultsToolbar
          filter={filter}
          rowSummary={rowSummary}
          hidden={!showToolbar}
          onChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        {/* View switcher with animated transitions */}
        <AnimatePresence mode="wait">
          {level === "portfolio" && (
            <motion.div
              key="portfolio"
              variants={FADE_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <PortfolioView
                segments={MOCK_SEGMENTS}
                isLoading={isLoading}
                onDrillSegment={drillSegment}
              />
            </motion.div>
          )}

          {level === "segment" && (
            <motion.div
              key="segment"
              variants={FADE_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <SegmentView
                segment={currentSeg}
                filter={filter}
                isLoading={isLoading}
                onDrillLoan={drillLoan}
                onClearFilters={clearFilters}
              />
            </motion.div>
          )}

          {level === "loan" && (
            <motion.div
              key="loan"
              variants={FADE_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <LoanView loan={currentLoan} isLoading={false} />
            </motion.div>
          )}

          {level === "empty" && (
            <motion.div
              key="empty"
              variants={FADE_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <ResultsEmptyState onClearFilters={clearFilters} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
