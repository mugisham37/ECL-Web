"use client";

import { motion } from "framer-motion";
import type { StageSlice } from "@/lib/dashboard-types";

interface DonutChartProps {
  data: StageSlice[];
  centerLabel?: string;
  centerValue?: string;
}

const CX = 70;
const CY = 70;
const R = 52;
const STROKE_W = 16;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function DonutChart({ data, centerLabel = "Lifetime", centerValue = "42%" }: DonutChartProps) {
  if (!data.length) return null;

  let offset = 0;

  return (
    <div className="donut-row">
      <svg
        viewBox="0 0 140 140"
        width={134}
        height={134}
        role="img"
        aria-label="ECL by stage"
        style={{ flexShrink: 0 }}
      >
        {data.map((slice, i) => {
          const len = (slice.percent / 100) * CIRCUMFERENCE;
          const dashArray = `${len} ${CIRCUMFERENCE - len}`;
          const dashOffset = -offset;
          offset += len;

          return (
            <motion.circle
              key={slice.stage}
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke={`var(--chart-${slice.colorVar})`}
              strokeWidth={STROKE_W}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${CX} ${CY})`}
              initial={{ strokeDashoffset: -offset + len }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}

        {/* Center text */}
        <text
          x={CX}
          y={65}
          textAnchor="middle"
          fontSize={11}
          fill="var(--text-muted)"
          fontFamily="var(--font-ui)"
        >
          {centerLabel}
        </text>
        <text
          x={CX}
          y={84}
          textAnchor="middle"
          fontSize={18}
          fill="var(--text)"
          fontFamily="var(--font-mono)"
          fontWeight={500}
        >
          {centerValue}
        </text>
      </svg>

      {/* Legend */}
      <div className="legend">
        {data.map((slice) => (
          <div key={slice.stage} className="lg">
            <span
              className="sw"
              style={{ background: `var(--chart-${slice.colorVar})` }}
            />
            <span style={{ fontSize: "var(--fs-body)", color: "var(--text)" }}>
              {slice.stage}
            </span>
            <span className="lv">{slice.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
