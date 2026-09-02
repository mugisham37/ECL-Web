import { ApiError } from "./client";

export interface FormattedApiError {
  summary: string;
  subSummary: string;
  code?: string;
  status?: number;
  hint: string;
  isServiceUnavailable?: boolean;
}

const ERROR_COPY: Record<
  string,
  { summary: string; subSummary: string; hint: string; isServiceUnavailable?: boolean }
> = {
  NETWORK_ERROR: {
    summary: "We couldn't connect to the service",
    subSummary: "The application could not reach the server.",
    hint: "Check your internet connection and try again. If the problem continues, contact your administrator.",
    isServiceUnavailable: true,
  },
  TIMEOUT: {
    summary: "This is taking longer than expected",
    subSummary: "The request did not finish in time.",
    hint: "Your files may be large. Wait a moment and try again.",
  },
  UNAUTHORIZED: {
    summary: "Your session has expired",
    subSummary: "You need to sign in again to continue.",
    hint: "Sign out, sign in again, then retry.",
  },
  NO_UPLOADS: {
    summary: "No files were found for this run",
    subSummary: "Upload your workbooks before validating.",
    hint: "Go back and upload your PD, LGD, and EAD files.",
  },
  MISSING_UPLOADS: {
    summary: "Some required files are missing",
    subSummary: "You need PD, LGD, and EAD files before validating.",
    hint: "Go back and upload all three file types.",
  },
  NO_PD_UPLOADS: {
    summary: "No PD file was found for this run",
    subSummary: "Upload at least one Probability of Default workbook first.",
    hint: "Go back and upload a PD file, then validate again.",
  },
  INVALID_FILE: {
    summary: "This workbook could not be read",
    subSummary: "The file is not a valid Excel workbook.",
    hint: "Re-export the file as .xlsx from Excel or the official PD template, then re-upload.",
  },
  INVALID_PD_PREVIEW: {
    summary: "PD validation returned an incomplete result",
    subSummary: "The checklist or preview was missing from the server response.",
    hint: "Retry validation. If it happens again, contact your administrator.",
  },
  INTERNAL_ERROR: {
    summary: "The validation service hit an unexpected error",
    subSummary: "This is a server problem, not a problem in your workbook.",
    hint: "Retry in a moment. If it happens again, the database may be missing a required migration.",
    isServiceUnavailable: true,
  },
  COMPUTE_DISPATCH_FAILED: {
    summary: "Could not start the computation",
    subSummary: "The calculation engine did not start.",
    hint: "Try again in a moment. If it keeps failing, contact your administrator.",
    isServiceUnavailable: true,
  },
};

export function formatApiError(err: unknown): FormattedApiError {
  if (err instanceof ApiError) {
    const copy = ERROR_COPY[err.code];
    if (copy) {
      return {
        summary: copy.summary,
        subSummary: copy.subSummary,
        code: err.code,
        status: err.status,
        hint: copy.hint,
        isServiceUnavailable: copy.isServiceUnavailable,
      };
    }
    if (err.status >= 500) {
      const server = ERROR_COPY.INTERNAL_ERROR;
      return {
        summary: server.summary,
        subSummary: err.message || server.subSummary,
        code: err.code,
        status: err.status,
        hint: server.hint,
        isServiceUnavailable: true,
      };
    }
    return {
      summary: "Something went wrong",
      subSummary: err.message,
      code: err.code,
      status: err.status,
      hint: "Try again. If the problem continues, contact your administrator.",
    };
  }

  if (err instanceof Error && err.message === "Failed to fetch") {
    const copy = ERROR_COPY.NETWORK_ERROR;
    return {
      summary: copy.summary,
      subSummary: copy.subSummary,
      code: "NETWORK_ERROR",
      hint: copy.hint,
      isServiceUnavailable: true,
    };
  }

  return {
    summary: "Something went wrong",
    subSummary: err instanceof Error ? err.message : "An unexpected error occurred.",
    hint: "Try again. If the problem continues, contact your administrator.",
  };
}
