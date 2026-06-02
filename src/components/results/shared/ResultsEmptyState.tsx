import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface ResultsEmptyStateProps {
  onClearFilters: () => void;
}

export function ResultsEmptyState({ onClearFilters }: ResultsEmptyStateProps) {
  return (
    <div className="rx-empty">
      <motion.div
        className="rx-empty-inner"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rx-empty-ic">
          <Search size={22} aria-hidden />
        </div>
        <h3>No loans match these filters</h3>
        <p>Try widening the stage filter or clearing the search.</p>
        <button
          onClick={onClearFilters}
          style={{
            marginTop: 4,
            height: "var(--control-h)",
            padding: "0 16px",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--r-sm)",
            background: "var(--surface)",
            color: "var(--text)",
            fontSize: "var(--fs-body)",
            fontWeight: "var(--fw-medium)",
            cursor: "pointer",
            transition: "background var(--t-micro)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--surface-sunken)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--surface)")}
        >
          Clear filters
        </button>
      </motion.div>
    </div>
  );
}
