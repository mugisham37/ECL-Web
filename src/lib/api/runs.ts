import { apiFetch, ApiError } from "./client";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Raw backend shapes (camelCase — matches RunListItemOut / RunDetailOut) ──

export interface RunListItemRaw {
  id: string;
  fullId: string;
  name: string;
  period: string;
  createdAt: string;
  byInitials: string;
  byName: string;
  status: string;
  eclAmount: number | null;
  coverage: string | null;
  currency: string;
}

export interface RunInputFileRaw {
  type: "PD" | "LGD" | "EAD";
  name: string;
  size: string;
  sheets: number;
  validationStatus: "ok" | "warn" | "error";
  warningCount?: number | null;
  hash: string;
}

export interface AuditEventRaw {
  id: string;
  kind: "ok" | "err" | "accent" | "default";
  iconName: string;
  title: string;
  description: string;
  who: string;
  time: string;
}

export interface EngineProgressStageRaw {
  status: "pending" | "running" | "complete" | "failed";
  started_at?: string | null;
  finished_at?: string | null;
  elapsed_ms?: number | null;
}

export interface EngineProgressRaw {
  pd: EngineProgressStageRaw;
  lgd: EngineProgressStageRaw;
  ead: EngineProgressStageRaw;
  ecl: EngineProgressStageRaw;
}

export interface FailureDetailsRaw {
  stage: string;
  message: string;
  ref: string;
}

export interface RunDetailRaw extends RunListItemRaw {
  elapsed?: string | null;
  kpis?: Array<{
    id: string;
    label: string;
    helpText?: string | null;
    currencyPrefix?: string | null;
    value: string;
    delta?: number | null;
    deltaDir?: "up" | "down" | "flat" | null;
    subNote?: string | null;
    staleAsOf?: string | null;
  }>;
  segments?: Array<{ name: string; value: number }>;
  inputFiles?: RunInputFileRaw[];
  auditEvents?: AuditEventRaw[];
  engineInfo?: {
    version: string;
    releasedDate: string;
    pdMethod: string;
    lgdMethod: string;
    eadMethod: string;
    pdFilesCombined: boolean;
    deterministic: boolean;
  };
  engineProgress?: EngineProgressRaw | null;
  failureDetails?: FailureDetailsRaw | null;
  deletedBy?: string | null;
  deletedAt?: string | null;
  acceptedWarnings?: number | null;
}

export interface ValidationIssueRaw {
  id: string;
  level: "warn" | "block";
  kind?: "PD" | "LGD" | "EAD";
  title: string;
  location?: string;
  fix?: string;
}

export interface ValidationResultRaw {
  status: "ok" | "warn" | "blocking";
  summary?: string;
  sub_summary?: string;
  issues: ValidationIssueRaw[];
  detected_segments?: string[];
  blocking_count?: number;
  warning_count?: number;
}

export interface UploadResultRaw {
  id: string;
  kind: "PD" | "LGD" | "EAD";
  filename: string;
  size_bytes?: number;
  sizeBytes?: number;
  sheet_count?: number;
  sheetCount?: number;
  row_count?: number;
  rowCount?: number;
  sha256: string;
}

export interface DownloadUrlRaw {
  url: string;
  expires_at: string;
}

// ── API functions ─────────────────────────────────────────────────────────

export interface FetchRunsParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}

export interface FetchRunsResult {
  items: RunListItemRaw[];
  meta: { page: number; per_page: number; total: number };
}

export async function fetchRuns(
  token: string,
  tenantId: string,
  params?: FetchRunsParams,
): Promise<FetchRunsResult> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.per_page) qs.set("per_page", String(params.per_page));
  if (params?.status && params.status !== "all") qs.set("status", params.status);
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString() ? `?${qs.toString()}` : "";
  const res = await fetch(`${BASE_URL}/api/v1/tenants/${tenantId}/runs${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      body.code ?? "API_ERROR",
      body.detail ?? "Request failed.",
      res.status,
    );
  }
  return {
    items: (body.data ?? []) as RunListItemRaw[],
    meta: body.meta ?? { page: 1, per_page: 50, total: 0 },
  };
}

export async function fetchRun(
  token: string,
  tenantId: string,
  runId: string,
): Promise<RunDetailRaw> {
  return apiFetch<RunDetailRaw>(`/tenants/${tenantId}/runs/${runId}`, { token });
}

export async function createRun(
  token: string,
  tenantId: string,
  body: { name: string; reporting_period?: string },
): Promise<RunDetailRaw> {
  return apiFetch<RunDetailRaw>(`/tenants/${tenantId}/runs`, {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });
}

export async function updateRun(
  token: string,
  tenantId: string,
  runId: string,
  body: { combine_pd_files?: boolean; name?: string; reporting_period?: string },
): Promise<RunDetailRaw> {
  return apiFetch<RunDetailRaw>(`/tenants/${tenantId}/runs/${runId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    token,
  });
}

export async function deleteRun(
  token: string,
  tenantId: string,
  runId: string,
): Promise<void> {
  return apiFetch<void>(`/tenants/${tenantId}/runs/${runId}`, {
    method: "DELETE",
    token,
  });
}

export async function rerunRun(
  token: string,
  tenantId: string,
  runId: string,
  body?: { name?: string },
): Promise<RunDetailRaw> {
  return apiFetch<RunDetailRaw>(`/tenants/${tenantId}/runs/${runId}/rerun`, {
    method: "POST",
    body: JSON.stringify(body ?? {}),
    token,
  });
}

export async function validateRun(
  token: string,
  tenantId: string,
  runId: string,
  body: { accepted_warning_ids: string[] },
): Promise<ValidationResultRaw> {
  return apiFetch<ValidationResultRaw>(
    `/tenants/${tenantId}/runs/${runId}/validate`,
    { method: "POST", body: JSON.stringify(body), token, timeoutMs: 180_000 },
  );
}

export async function executeRun(
  token: string,
  tenantId: string,
  runId: string,
): Promise<{ run_id: string; status: string }> {
  return apiFetch<{ run_id: string; status: string }>(
    `/tenants/${tenantId}/runs/${runId}/execute`,
    { method: "POST", body: JSON.stringify({}), token },
  );
}

export async function getDownloadUrl(
  token: string,
  tenantId: string,
  runId: string,
  kind: "PD_CALCS" | "LGD" | "RUNDOWN" | "ECL_SUMMARY",
): Promise<DownloadUrlRaw> {
  return apiFetch<DownloadUrlRaw>(
    `/tenants/${tenantId}/runs/${runId}/downloads/${kind}`,
    { token },
  );
}

export async function downloadTemplate(
  token: string,
  tenantId: string,
  kind: "PD" | "LGD" | "EAD",
): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/api/v1/tenants/${tenantId}/templates/${kind}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    },
  );
  if (!res.ok) {
    throw new ApiError("DOWNLOAD_FAILED", "Template download failed.", res.status);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ECL_${kind}_template.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function deleteUpload(
  token: string,
  tenantId: string,
  runId: string,
  uploadId: string,
): Promise<void> {
  return apiFetch<void>(`/tenants/${tenantId}/runs/${runId}/uploads/${uploadId}`, {
    token,
    method: "DELETE",
  });
}

// ── XHR file upload with progress ─────────────────────────────────────────

export async function uploadRunFile(
  token: string,
  tenantId: string,
  runId: string,
  kind: "PD" | "LGD" | "EAD",
  file: File,
  onProgress?: (pct: number) => void,
): Promise<UploadResultRaw> {
  return new Promise<UploadResultRaw>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const body = JSON.parse(xhr.responseText);
          resolve(body.data as UploadResultRaw);
        } catch {
          reject(new ApiError("PARSE_ERROR", "Invalid upload response.", xhr.status));
        }
      } else {
        let detail = "Upload failed.";
        try {
          detail = JSON.parse(xhr.responseText)?.detail ?? detail;
        } catch { /* ignore */ }
        reject(new ApiError("UPLOAD_FAILED", detail, xhr.status));
      }
    };

    xhr.onerror = () => {
      reject(new ApiError("NETWORK_ERROR", "Network error during upload.", 0));
    };

    xhr.open("POST", `${BASE_URL}/api/v1/tenants/${tenantId}/runs/${runId}/uploads`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    const form = new FormData();
    form.append("kind", kind);
    form.append("file", file);
    xhr.send(form);
  });
}
