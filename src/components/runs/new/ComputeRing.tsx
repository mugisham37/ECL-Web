"use client";

import { motion } from "framer-motion";

const R = 44;
const STROKE_W = 7;
const CIRCUMFERENCE = 2 * Math.PI * R;

interface ComputeRingProps {
  progress: number; // 0–100
}

export function ComputeRing({ progress }: ComputeRingProps) {
  const offset = CIRCUMFERENCE * (1 - progress / 100);

  return (
    <div className="compute-ring" aria-label={`${progress}% complete`} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <svg viewBox="0 0 96 96" width={96} height={96}>
        {/* Track */}
        <circle
          cx={48} cy={48} r={R}
          fill="none"
          stroke="var(--surface-sunken)"
          strokeWidth={STROKE_W}
        />
        {/* Progress arc */}
        <motion.circle
          cx={48} cy={48} r={R}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.3, ease: "linear" }}
          transform="rotate(-90 48 48)"
        />
      </svg>
      <div className="pct">{progress}%</div>
    </div>
  );
}
