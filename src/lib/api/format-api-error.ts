import { ApiError } from "./client";

export interface FormattedApiError {
  summary: string;
  subSummary: string;
  code?: string;
  status?: number;
  hint: string;
}

const HINTS: Record<string, string> = {
  UNAUTHORIZED: "Your session may have expired. Sign out, sign in again, then retry validation.",
  NO_UPLOADS: "Upload PD, LGD, and EAD files on the previous step before validating.",
  TIMEOUT:
    "Large Excel workbooks can take a minute or more. Wait a moment and retry validation.",
  NETWORK_ERROR:
    "Confirm ECL-Server is running (`uvicorn` on port 8000) and Docker services are up.",
};

export function formatApiError(err: unknown): FormattedApiError {
  if (err instanceof ApiError) {
    return {
      summary: "Validation could not complete",
      subSummary: err.message,
      code: err.code,
      status: err.status,
      hint:
        HINTS[err.code] ??
        "Try again. If it keeps failing, check the ECL-Server terminal for errors.",
    };
  }

  if (err instanceof Error && err.message === "Failed to fetch") {
    return {
      summary: "Could not reach the server",
      subSummary: "The browser did not receive a response from the validation API.",
      hint: HINTS.NETWORK_ERROR,
    };
  }

  return {
    summary: "Validation failed",
    subSummary:
      err instanceof Error ? err.message : "An unexpected error occurred.",
    hint: "Try again. If the problem persists, check the server logs.",
  };
}
