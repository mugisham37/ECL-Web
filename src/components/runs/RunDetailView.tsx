"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RunDetailHeader } from "./RunDetailHeader";
import { RunDetailKpiStrip } from "./RunDetailKpiStrip";
import { RunDetailTabs } from "./RunDetailTabs";
import { RunActionModal } from "./RunActionModal";
import type { ModalKind } from "./RunActionModal";
import type { RunDetail } from "@/lib/runs-types";

interface RunDetailViewProps {
  run: RunDetail;
}

export function RunDetailView({ run }: RunDetailViewProps) {
  const [modalKind, setModalKind] = useState<ModalKind>(null);

  function openModal(kind: NonNullable<ModalKind>) {
    setModalKind(kind);
  }

  function handleModalAction(action: "delete" | "rerun" | "restore") {
    // In production: dispatch server action. For now, just close.
    setModalKind(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header (back btn, banner, title, meta, actions) */}
      <RunDetailHeader run={run} onOpenModal={openModal} />

      {/* KPI strip */}
      <RunDetailKpiStrip run={run} />

      {/* Tabs */}
      <RunDetailTabs
        run={run}
        onRerun={() => openModal("rerun")}
      />

      {/* Action modal */}
      <RunActionModal
        kind={modalKind}
        onClose={() => setModalKind(null)}
        onAction={handleModalAction}
      />
    </motion.div>
  );
}
