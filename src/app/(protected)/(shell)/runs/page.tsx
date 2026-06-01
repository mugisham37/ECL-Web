import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Runs — ECL Platform",
};

export default function RunsPage() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Runs</h1>
          <div className="ph-sub">
            <span>All ECL computation runs</span>
          </div>
        </div>
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-body)" }}>
        Runs — coming in Flow 5.
      </p>
    </div>
  );
}
