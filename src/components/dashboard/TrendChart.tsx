"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { TrendPoint, TrendWindow } from "@/lib/dashboard-types";

interface TrendChartProps {
  data: TrendPoint[];
  dimmed?: boolean;
}

const W = 1080;
const H = 200;
const PAD = 30;

function computePath(points: TrendPoint[]): { xy: [number, number][]; path: string; area: string } {
  if (points.length < 2) return { xy: [], path: "", area: "" };
  const vals = points.map((p) => p.value);
  const min = Math.min(...vals) * 0.97;
  const max = Math.max(...vals) * 1.03;
  const range = max - min || 1;

  const xy: [number, number][] = points.map((_, i) => [
    PAD + (i / (points.length - 1)) * (W - PAD * 2),
    H - PAD - ((vals[i] - min) / range) * (H - PAD * 2),
  ]);

  const path = xy.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const lastX = xy[xy.length - 1][0].toFixed(1);
  const area = `${path} L${lastX} ${H - PAD} L${PAD} ${H - PAD} Z`;

  return { xy, path, area };
}

const WINDOWS: TrendWindow[] = ["12M", "6M", "3M"];

export function TrendChart({ data, dimmed = false }: TrendChartProps) {
  const [window, setWindow] = useState<TrendWindow>("12M");

  const sliceMap: Record<TrendWindow, number> = { "12M": 12, "6M": 6, "3M": 3 };
  const sliced = data.slice(-sliceMap[window]);
  const { xy, path, area } = computePath(sliced);

  const lastPoint = xy[xy.length - 1];

  return (
    <div
      className="trend-card"
      style={dimmed ? { opacity: 0.45, pointerEvents: "none" } : undefined}
    >
      <div className="trend-head">
        <h3>12-month ECL trend</h3>
        <div className="trend-toggle" role="group" aria-label="Time window">
          {WINDOWS.map((w) => (
            <button
              key={w}
              data-active={window === w ? "true" : "false"}
              onClick={() => setWindow(w)}
              aria-pressed={window === w}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div className="cc-body" style={{ overflow: "hidden" }}>
        {sliced.length >= 2 ? (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            role="img"
            aria-label={`${window} ECL trend`}
            style={{ display: "block" }}
          >
            <defs>
              <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--accent)" stopOpacity={0.16} />
                <stop offset="1" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 1, 2, 3].map((i) => {
              const y = (PAD + i * (H - PAD * 2) / 3).toFixed(0);
              return (
                <line
                  key={i}
                  x1={PAD}
                  x2={W - PAD}
                  y1={y}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth={1}
                />
              );
            })}

            {/* Area fill */}
            <path d={area} fill="url(#tg)" />

            {/* Line */}
            <motion.path
              d={path}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* End dot */}
            {lastPoint && (
              <circle
                cx={lastPoint[0].toFixed(1)}
                cy={lastPoint[1].toFixed(1)}
                r={4}
                fill="var(--accent)"
              />
            )}

            {/* Month labels */}
            {sliced.map((pt, i) => (
              <text
                key={`trend-label-${i}`}
                x={(PAD + (i / (sliced.length - 1)) * (W - PAD * 2)).toFixed(1)}
                y={H - 8}
                textAnchor="middle"
                fontSize={11}
                fill="var(--text-subtle)"
                fontFamily="var(--font-mono)"
              >
                {pt.label}
              </text>
            ))}
          </svg>
        ) : (
          <p style={{ color: "var(--text-subtle)", fontSize: "var(--fs-caption)", padding: "16px 0" }}>
            Not enough data for selected window.
          </p>
        )}
      </div>
    </div>
  );
}
