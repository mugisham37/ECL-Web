"use client";

import { motion } from "framer-motion";
import { KpiCard } from "./KpiCard";
import type { KpiData } from "@/lib/dashboard-types";

interface KpiStripProps {
  kpis: KpiData[];
  locked?: boolean;
  stale?: boolean;
}

export function KpiStrip({ kpis, locked = false, stale = false }: KpiStripProps) {
  return (
    <div className="kpi-strip">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
        >
          <KpiCard {...kpi} locked={locked} stale={stale} />
        </motion.div>
      ))}
    </div>
  );
}
