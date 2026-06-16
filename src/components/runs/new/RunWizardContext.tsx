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
      return { ...state, pdFiles: [...state.pdFiles, action.file] };

    case "REMOVE_PD_FILE":
      return { ...state, pdFiles: state.pdFiles.filter((f) => f.id !== action.id) };

    case "SET_LGD_FILE":
      return { ...state, lgdFile: action.file };

    case "SET_EAD_FILE":
      return { ...state, eadFile: action.file };

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

export function isUploadReady(state: NewRunState): boolean {
  const pdOk  = state.pdFiles.some((f) => f.status === "ok" || f.status === "warn");
  const lgdOk = state.lgdFile !== null && (state.lgdFile.status === "ok" || state.lgdFile.status === "warn");
  const eadOk = state.eadFile !== null && (state.eadFile.status === "ok" || state.eadFile.status === "warn");
  return pdOk && lgdOk && eadOk;
}

export function canContinueFrom(state: NewRunState): boolean {
  if (state.step === "upload") return isUploadReady(state);
  if (state.step === "validate") {
    if (state.isValidating) return false;
    if (!state.validationResult) return false;
    return state.validationResult.status !== "blocking";
  }
  return true;
}
