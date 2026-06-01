import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Results — ECL Platform",
};

export default function ResultsPage() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Results</h1>
          <div className="ph-sub">
            <span>ECL results explorer</span>
          </div>
        </div>
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-body)" }}>
        Results — coming in Flow 7.
      </p>
    </div>
  );
}
