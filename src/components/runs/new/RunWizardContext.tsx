"use client";

import { createContext, useContext, useReducer, type Dispatch } from "react";
import {
  DEFAULT_COMPUTE_STAGES,
  type NewRunState,
  type NewRunAction,
  type UploadedFile,
} from "@/lib/new-run-types";

// ── Default state ──────────────────────────────────────────────────────────

const initialState: NewRunState = {
  step: "upload",
  prevStep: "upload",
  runName: "May 2026",
  runId: null,
  runInitError: null,
  pdFiles: [],
  lgdFile: null,
  eadFile: null,
  combinePdFiles: true,
  validationResult: null,
  isValidating: false,
  pdPreview: null,
  pdPreviewStatus: "idle",
  pdPreviewError: null,
  computeProgress: 0,
  computeStages: DEFAULT_COMPUTE_STAGES.map((s) => ({ ...s, status: "pending" as const })),
  result: null,
  failureDetails: null,
  cancelModalOpen: false,
  uploadProgress: {},
  uploadedFileIds: {},
  acceptedWarningIds: [],
};

// ── Reducer ────────────────────────────────────────────────────────────────

function reducer(state: NewRunState, action: NewRunAction): NewRunState {
  switch (action.type) {
    case "SET_RUN_NAME":
      return { ...state, runName: action.name };

    case "ADD_PD_FILE":
      return {
        ...state,
        pdFiles: [...state.pdFiles, action.file],
        pdPreview: null,
        pdPreviewStatus: "idle",
        pdPreviewError: null,
        validationResult: null,
        isValidating: false,
      };

    case "REMOVE_PD_FILE":
      return {
        ...state,
        pdFiles: state.pdFiles.filter((f) => f.id !== action.id),
        pdPreview: null,
        pdPreviewStatus: "idle",
        pdPreviewError: null,
        validationResult: null,
        isValidating: false,
      };

    case "SET_LGD_FILE":
      return { ...state, lgdFile: action.file, validationResult: null, isValidating: false };

    case "SET_EAD_FILE":
      return { ...state, eadFile: action.file, validationResult: null, isValidating: false };

    case "SET_COMBINE_PD":
      return { ...state, combinePdFiles: action.value };

    case "GO_TO_STEP":
      return { ...state, prevStep: state.step, step: action.step };

    case "START_VALIDATING":
      return { ...state, isValidating: true, validationResult: null };

    case "SET_VALIDATION_RESULT":
      return { ...state, isValidating: false, validationResult: action.result };

    case "SET_COMPUTE_PROGRESS":
      return { ...state, computeProgress: action.pct };

    case "SET_COMPUTE_STAGES":
      return { ...state, computeStages: action.stages };

    case "SET_RESULT":
      return { ...state, result: action.result };

    case "SET_FAILURE":
      return { ...state, failureDetails: action.details };

    case "OPEN_CANCEL_MODAL":
      return { ...state, cancelModalOpen: true };

    case "CLOSE_CANCEL_MODAL":
      return { ...state, cancelModalOpen: false };

    case "SET_RUN_ID":
      return { ...state, runId: action.runId, runInitError: null };

    case "SET_RUN_INIT_ERROR":
      return { ...state, runInitError: action.error };

    case "SET_UPLOAD_PROGRESS":
      return { ...state, uploadProgress: { ...state.uploadProgress, [action.fileId]: action.progress } };

    case "SET_UPLOADED_FILE_ID":
      return { ...state, uploadedFileIds: { ...state.uploadedFileIds, [action.fileId]: action.serverId } };

    case "UPDATE_FILE_STATUS": {
      const { id, status, hash, sheets, errorMessage, backendUploadId } = action;
      function patchFile(f: UploadedFile): UploadedFile {
        if (f.id !== id) return f;
        return {
          ...f,
          status,
          ...(hash !== undefined ? { hash } : {}),
          ...(sheets !== undefined ? { sheets } : {}),
          ...(errorMessage !== undefined ? { errorMessage } : {}),
          ...(backendUploadId !== undefined ? { backendUploadId } : {}),
        };
      }
      return {
        ...state,
        pdFiles: state.pdFiles.map(patchFile),
        lgdFile: state.lgdFile ? patchFile(state.lgdFile) : null,
        eadFile: state.eadFile ? patchFile(state.eadFile) : null,
      };
    }

    case "SET_ACCEPTED_WARNING_IDS":
      return { ...state, acceptedWarningIds: action.ids };

    case "CLEAR_VALIDATION_RESULT":
      return { ...state, validationResult: null, isValidating: false };

    case "START_PD_VALIDATING":
      return { ...state, pdPreview: null, pdPreviewStatus: "loading", pdPreviewError: null };

    case "SET_PD_PREVIEW":
      return {
        ...state,
        pdPreview: action.result,
        pdPreviewStatus: action.result.status === "blocking" ? "blocked" : "ready",
        pdPreviewError: null,
      };

    case "SET_PD_PREVIEW_ERROR":
      return { ...state, pdPreview: null, pdPreviewStatus: "error", pdPreviewError: action.error };

    case "CLEAR_PD_PREVIEW":
      return { ...state, pdPreview: null, pdPreviewStatus: "idle", pdPreviewError: null };

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────────

interface RunWizardContextValue {
  state: NewRunState;
  dispatch: Dispatch<NewRunAction>;
}

const RunWizardContext = createContext<RunWizardContextValue | null>(null);

export function RunWizardProvider({
  children,
  initialRunId = null,
  initialRunInitError = null,
}: {
  children: React.ReactNode;
  initialRunId?: string | null;
  initialRunInitError?: string | null;
}) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    runId: initialRunId,
    runInitError: initialRunInitError,
  });
  return (
    <RunWizardContext.Provider value={{ state, dispatch }}>
      {children}
    </RunWizardContext.Provider>
  );
}

export function useRunWizard() {
  const ctx = useContext(RunWizardContext);
  if (!ctx) throw new Error("useRunWizard must be inside RunWizardProvider");
  return ctx;
}

// ── Validation helpers ────────────────────────────────────────────────────

export function fileIsReady(file: UploadedFile | null): boolean {
  return file !== null && (file.status === "ok" || file.status === "warn");
}

export function pdFilesReady(state: NewRunState): boolean {
  return state.pdFiles.some((f) => fileIsReady(f));
}

export function hasLgdAndEad(state: NewRunState): boolean {
  return fileIsReady(state.lgdFile) && fileIsReady(state.eadFile);
}

export function isUploadReady(state: NewRunState): boolean {
  return pdFilesReady(state) && hasLgdAndEad(state);
}

export function canContinueFrom(state: NewRunState): boolean {
  if (state.step === "upload") return isUploadReady(state);
  if (state.step === "validate") {
    if (state.pdPreviewStatus === "loading" || state.pdPreviewStatus === "blocked" || state.pdPreviewStatus === "error") {
      return false;
    }
    if (pdFilesReady(state) && state.pdPreviewStatus !== "ready") return false;
    if (!hasLgdAndEad(state)) return false;
    if (state.isValidating) return false;
    if (!state.validationResult) return false;
    if (state.validationResult.requestError) return false;
    if (state.validationResult.status === "blocking") return false;
    if (state.validationResult.status === "warn") {
      const warningIds = state.validationResult.fileResults.flatMap((fr) =>
        fr.issues.filter((i) => i.level === "warn").map((i) => i.id),
      );
      if (warningIds.length === 0) return true;
      return warningIds.every((id) => state.acceptedWarningIds.includes(id));
    }
    return true;
  }
  return true;
}

export function getFooterHint(state: NewRunState): string {
  if (state.step === "upload") {
    return "Add all three file types first";
  }
  if (state.step === "validate") {
    if (!hasLgdAndEad(state)) {
      return "Upload LGD and EAD to continue";
    }
    if (state.pdPreviewStatus === "blocked") {
      return "Fix the errors in your files before continuing";
    }
    if (state.pdPreviewStatus === "error") {
      return "Resolve the issue above, then retry";
    }
    if (state.validationResult?.requestError?.isServiceUnavailable) {
      return "Service unavailable — retry validation";
    }
    if (state.validationResult?.requestError) {
      return "Resolve the issue above, then retry";
    }
    if (state.validationResult?.status === "warn") {
      const warningIds = state.validationResult.fileResults.flatMap((fr) =>
        fr.issues.filter((i) => i.level === "warn").map((i) => i.id),
      );
      const allAccepted = warningIds.every((id) => state.acceptedWarningIds.includes(id));
      if (!allAccepted) {
        return "Review and accept warnings to continue";
      }
    }
    return "Fix the errors in your files before continuing";
  }
  return "Complete this step to continue";
}
