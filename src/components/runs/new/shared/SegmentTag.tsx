export function SegmentTag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 22,
        padding: "0 8px",
        borderRadius: "var(--r-sm)",
        background: "var(--surface-sunken)",
        border: "1px solid var(--border)",
        fontSize: "var(--fs-caption)",
        color: "var(--text-muted)",
        fontWeight: "var(--fw-medium)" as React.CSSProperties["fontWeight"],
      }}
    >
      {label}
    </span>
  );
}
