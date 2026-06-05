"use client";

import { useApiSession } from "./use-api-session";
import { uploadRunFile, type UploadResultRaw } from "@/lib/api/runs";

function truncateHash(hex: string): string {
  if (!hex || hex.length < 8) return hex;
  return hex.slice(0, 4) + "…" + hex.slice(-4);
}

export function useFileUpload() {
  const { token, tenantId } = useApiSession();

  async function computeSha256(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hex = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return truncateHash(hex);
  }

  async function uploadFile(
    runId: string,
    kind: "PD" | "LGD" | "EAD",
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<UploadResultRaw> {
    if (!token || !tenantId) throw new Error("Not authenticated");
    return uploadRunFile(token, tenantId, runId, kind, file, onProgress);
  }

  return { uploadFile, computeSha256 };
}
