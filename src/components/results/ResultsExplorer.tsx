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
import { useAuthedQuery } from "@/hooks/use-authed-query";
import { useApiSession } from "@/hooks/use-api-session";
import { fetchPortfolio, fetchSegmentResults, fetchLoanResults } from "@/lib/api/results";
import {
  mapPortfolio,
  mapLoanDetail,
  mapLoanRow,
  mapPdMatrix,
} from "@/lib/api/mappers";
import { defaultFilter } from "@/lib/results-types";
import type { DrillLevel, ExplorerFilter, RunContext } from "@/lib/results-types";

const FADE_VARIANTS = {
  hidden:  { opacity: 0, y: 4  },
  visible: { opacity: 1, y: 0  },
  exit:    { opacity: 0, y: -4 },
};

const EMPTY_CONTEXT: RunContext = {
  runId: "",
  period: "—",
  computedAt: "—",
  engineVersion: "—",
  currency: "KES",
};

interface ResultsExplorerProps {
  initialRunId?: string;
}

export function ResultsExplorer({ initialRunId }: ResultsExplorerProps) {
  const { tenantId } = useApiSession();
  const [level,   setLevel]   = useState<DrillLevel>("portfolio");
  const [curSeg,  setCurSeg]  = useState("");
  const [curLoan, setCurLoan] = useState("");
  const [filter,  setFilter]  = useState<ExplorerFilter>(defaultFilter);
  const [density, setDensity] = useState<"compact" | "comfortable">("compact");
  const [runId,   setRunId]   = useState(initialRunId ?? "");

  // Portfolio query
  const portfolioQuery = useAuthedQuery(
    ["portfolio", tenantId, runId, filter.stageFilters.indexOf(false) >= 0 ? filter.stageFilters.join() : "all"],
    (token, tid) => fetchPortfolio(token, tid, { run_id: runId || undefined }),
    { staleTime: 60_000 },
  );

  // Segment query — only enabled when drilling into a segment
  const segmentQuery = useAuthedQuery(
    ["segment", tenantId, runId, curSeg],
    (token, tid) =>
      fetchSegmentResults(token, tid, curSeg, { run_id: runId || undefined, per_page: 100 }),
    { enabled: level === "segment" && !!curSeg, staleTime: 60_000 },
  );

  // Loan query — only enabled when drilling into a loan
  const loanQuery = useAuthedQuery(
    ["loan", tenantId, runId, curLoan],
    (token, tid) => fetchLoanResults(token, tid, curLoan, { run_id: runId || undefined }),
    { enabled: level === "loan" && !!curLoan, staleTime: 60_000 },
  );

  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    wrapRef.current?.setAttribute("data-density", density);
  }, [density]);

  function drill(lvl: DrillLevel) {
    setLevel(lvl);
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
    setFilter((prev) => ({ ...prev, ...patch }));
  }

  // Derived data
  const portfolioResult = portfolioQuery.data ? mapPortfolio(portfolioQuery.data) : null;
  const portfolioSegments = portfolioResult?.segments ?? [];
  const partialContext = portfolioResult?.context ?? {};

  const runContext: RunContext = {
    runId: partialContext.runId ?? runId,
    period: partialContext.period ?? "—",
    computedAt: partialContext.computedAt ?? "—",
    engineVersion: partialContext.engineVersion ?? "—",
    currency: partialContext.currency ?? "KES",
  };

  const displayContext = portfolioQuery.data ? runContext : EMPTY_CONTEXT;
  const currency = displayContext.currency;

  const segmentLoans = segmentQuery.data
    ? (segmentQuery.data.loans ?? []).map(mapLoanRow)
    : [];

  const segmentPdMatrix = mapPdMatrix(segmentQuery.data?.pd_matrix);

  const currentSeg = portfolioSegments.find((s) => s.name === curSeg) ?? portfolioSegments[0];

  const currentLoan = loanQuery.data ? mapLoanDetail(loanQuery.data) : null;

  const rowSummary = useMemo(() => {
    if (level === "portfolio") {
      const totalEcl = portfolioSegments.reduce((a, s) => a + s.ecl, 0);
      return `${portfolioSegments.length} segments · ${currency} ${totalEcl >= 1_000_000 ? (totalEcl / 1_000_000).toFixed(1) + "M" : totalEcl.toLocaleString()}`;
    }
    if (level === "segment" && currentSeg) {
      return `${currentSeg.loans.toLocaleString()} loans · ${currency} ${currentSeg.ecl >= 1_000_000 ? (currentSeg.ecl / 1_000_000).toFixed(1) + "M" : currentSeg.ecl.toLocaleString()}`;
    }
    if (level === "loan") return `Loan ${curLoan}`;
    return "0 results";
  }, [level, portfolioSegments, currentSeg, curLoan, currency]);

  const showToolbar = level !== "loan";
  const isPortfolioLoading = portfolioQuery.isLoading;
  const isSegmentLoading = segmentQuery.isLoading;
  const isLoanLoading = loanQuery.isLoading;

  return (
    <div ref={wrapRef} data-density={density}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Run context header */}
        <ResultsHeader
          runContext={displayContext}
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
                segments={portfolioSegments}
                isLoading={isPortfolioLoading}
                currency={currency}
                onDrillSegment={drillSegment}
              />
            </motion.div>
          )}

          {level === "segment" && currentSeg && (
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
                isLoading={isSegmentLoading}
                loans={segmentLoans}
                pdMatrix={segmentPdMatrix}
                currency={currency}
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
              {currentLoan ? (
                <LoanView loan={currentLoan} isLoading={isLoanLoading} />
              ) : (
                <LoanView loan={{
                  id: curLoan, customer: "Loading...", stage: 1, pd: 0, lgd: 0, ead: 0, ecl: 0,
                  segment: curSeg, outstanding: 0, collateralValue: 0, maturity: "—", rundown: [],
                }} isLoading={true} />
              )}
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
