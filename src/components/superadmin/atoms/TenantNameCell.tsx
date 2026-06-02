interface TenantNameCellProps {
  mark: string;
  color: string;
  name: string;
}

export function TenantNameCell({ mark, color, name }: TenantNameCellProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        className="tn-mark"
        style={{
          background: `color-mix(in srgb, ${color} 16%, transparent)`,
          color,
        }}
      >
        {mark}
      </span>
      <span style={{ fontWeight: "var(--fw-medium)" as string }}>{name}</span>
    </div>
  );
}
