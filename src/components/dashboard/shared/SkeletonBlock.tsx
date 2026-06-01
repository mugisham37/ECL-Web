interface SkeletonBlockProps {
  height?: number | string;
  width?: number | string;
  className?: string;
}

export function SkeletonBlock({ height = 16, width = "100%", className = "" }: SkeletonBlockProps) {
  return (
    <div
      className={`skel ${className}`}
      style={{ height, width }}
      aria-hidden="true"
    />
  );
}
