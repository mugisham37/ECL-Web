"use client";

import { motion } from "framer-motion";
import type { SegmentBar } from "@/lib/dashboard-types";

interface BarChartProps {
  data: SegmentBar[];
}

const ROW_H = 30;
const LABEL_W = 118;
const VALUE_W = 48;
const CHART_W = 460;
const BAR_AREA = CHART_W - LABEL_W - VALUE_W - 12;

export function BarChart({ data }: BarChartProps) {
  if (!data.length) return null;
  const maxVal = Math.max(...data.map((d) => d.value));

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${data.length * ROW_H}`}
      width="100%"
      role="img"
      aria-label="ECL by segment"
    >
      {data.map((item, i) => {
        const y = i * ROW_H;
        const barW = maxVal > 0 ? (item.value / maxVal) * BAR_AREA : 0;
        const barX = LABEL_W;

        return (
          <g key={item.name}>
            {/* Segment label */}
            <text
              x={0}
              y={y + 19}
              fontSize={12}
              fill="var(--text-muted)"
              fontFamily="var(--font-ui)"
            >
              {item.name}
            </text>

            {/* Track */}
            <rect
              x={barX}
              y={y + 7}
              width={BAR_AREA}
              height={16}
              rx={3}
              fill="var(--surface-sunken)"
            />

            {/* Fill bar (animated) */}
            <motion.rect
              x={barX}
              y={y + 7}
              width={barW}
              height={16}
              rx={3}
              fill="var(--chart-1)"
              initial={{ width: 0 }}
              animate={{ width: barW }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Value label */}
            <text
              x={barX + BAR_AREA + 8}
              y={y + 19}
              fontSize={12}
              fill="var(--text)"
              fontFamily="var(--font-mono)"
            >
              {item.value}k
            </text>
          </g>
        );
      })}
    </svg>
  );
}
