interface EngineInfoRowProps {
  label: string;
  children: React.ReactNode;
}

export function EngineInfoRow({ label, children }: EngineInfoRowProps) {
  return (
    <div className="engine-row">
      <span className="er-k">{label}</span>
      <span style={{ color: "var(--text)", fontSize: "var(--fs-body)" }}>{children}</span>
    </div>
  );
}
