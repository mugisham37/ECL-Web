import type { LoanDetail } from "@/lib/results-types";

function fmtKes(n: number): string { return Math.abs(n).toLocaleString("en-US"); }

interface LoanIdentityGridProps {
  loan: LoanDetail;
}

export function LoanIdentityGrid({ loan }: LoanIdentityGridProps) {
  const cells = [
    { k: "Customer",        v: loan.customer },
    { k: "Outstanding",     v: <span style={{ fontFamily: "var(--font-mono)" }}>{fmtKes(loan.outstanding)}</span> },
    { k: "Collateral value",v: <span style={{ fontFamily: "var(--font-mono)" }}>{fmtKes(loan.collateralValue)}</span> },
    { k: "Maturity",        v: loan.maturity },
  ];

  return (
    <div className="loan-identity">
      {cells.map(({ k, v }) => (
        <div key={k} className="loan-id-cell">
          <div className="lic-k">{k}</div>
          <div className="lic-v">{v}</div>
        </div>
      ))}
    </div>
  );
}
