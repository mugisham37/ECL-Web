interface QueueBarProps {
  running: number;
  queued: number;
  total: number;
}

export function QueueBar({ running, queued, total }: QueueBarProps) {
  return (
    <div className="queue-bar" role="img" aria-label={`${running} running, ${queued} queued`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`qb ${i < running ? "run" : i < running + queued ? "queue" : ""}`}
        />
      ))}
    </div>
  );
}
