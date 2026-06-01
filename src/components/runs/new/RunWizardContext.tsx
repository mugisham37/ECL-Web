"use client";

import { createContext, useContext, useReducer, type Dispatch } from "react";
import {
  DEFAULT_COMPUTE_STAGES,
  SEED_FILES,
  type NewRunState,
  type NewRunAction,
} from "@/lib/new-run-types";

// ── Default state ──────────────────────────────────────────────────────────

const initialState: NewRunState = {
  step: "upload",
  prevStep: "upload",
  runName: "May 2026",
  pdFiles: [SEED_FILES.PD],
  lgdFile: SEED_FILES.LGD,
  eadFile: SEED_FILES.EAD,
  combinePdFiles: true,
  validationResult: null,
  isValidating: false,
  computeProgress: 0,
  computeStages: DEFAULT_COMPUTE_STAGES.map((s) => ({ ...s, status: "pending" as const })),
  result: null,
  failureDetails: null,
  cancelModalOpen: false,
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

export function RunWizardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
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
  return state.pdFiles.length > 0 && state.lgdFile !== null && state.eadFile !== null;
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
