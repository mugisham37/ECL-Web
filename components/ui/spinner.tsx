import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "sm" | "default" | "lg"
  className?: string
}

const sizeMap = { sm: "size-3", default: "size-4", lg: "size-5" }

export function Spinner({ size = "default", className }: SpinnerProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border-2 border-current border-t-transparent",
        "animate-[spin_0.7s_linear_infinite]",
        sizeMap[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
}
