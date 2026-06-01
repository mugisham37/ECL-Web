"use client";

import { createContext, useContext, useReducer, type Dispatch } from "react";
import type { Profile, Segment, CollateralItem, InviteEntry } from "@/lib/onboarding-schema";
import {
  COMMON_SEGMENTS,
  COMMON_COLLATERAL,
} from "@/lib/onboarding-schema";

// ── Types ──────────────────────────────────────────────────────────────────

export type WizardStep = "welcome" | 0 | 1 | 2 | 3 | 4 | "done";

export interface WizardState {
  step: WizardStep;
  prevStep: WizardStep;
  profile: Profile;
  segments: Segment[];
  collateral: CollateralItem[];
  invites: InviteEntry[];
  skipModalOpen: boolean;
  requiredModalOpen: boolean;
  doneVariant: "success" | "saved";
}

export type WizardAction =
  | { type: "GO_TO_STEP"; step: WizardStep }
  | { type: "SET_PROFILE"; patch: Partial<Profile> }
  | { type: "ADD_SEGMENT" }
  | { type: "UPDATE_SEGMENT"; id: string; patch: Partial<Omit<Segment, "id">> }
  | { type: "DELETE_SEGMENT"; id: string }
  | { type: "ADD_COMMON_SEGMENTS" }
  | { type: "ADD_COLLATERAL" }
  | { type: "UPDATE_COLLATERAL"; id: string; patch: Partial<Omit<CollateralItem, "id">> }
  | { type: "DELETE_COLLATERAL"; id: string }
  | { type: "ADD_COMMON_COLLATERAL" }
  | { type: "ADD_INVITE"; entry: InviteEntry }
  | { type: "DELETE_INVITE"; email: string }
  | { type: "OPEN_SKIP_MODAL" }
  | { type: "OPEN_REQUIRED_MODAL" }
  | { type: "CLOSE_MODAL" }
  | { type: "FINISH_DONE"; variant: "success" | "saved" };

// ── Default state ──────────────────────────────────────────────────────────

const defaultState: WizardState = {
  step: "welcome",
  prevStep: "welcome",
  profile: {
    institutionName: "",
    currency: "KES",
    timezone: "Africa/Nairobi",
    cadence: "Monthly",
  },
  segments: [],
  collateral: [],
  invites: [],
  skipModalOpen: false,
  requiredModalOpen: false,
  doneVariant: "success",
};

// ── Reducer ────────────────────────────────────────────────────────────────

function uuid(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "GO_TO_STEP":
      return { ...state, prevStep: state.step, step: action.step };

    case "SET_PROFILE":
      return { ...state, profile: { ...state.profile, ...action.patch } };

    case "ADD_SEGMENT":
      return {
        ...state,
        segments: [...state.segments, { id: uuid(), name: "", code: "" }],
      };

    case "UPDATE_SEGMENT":
      return {
        ...state,
        segments: state.segments.map((s) =>
          s.id === action.id ? { ...s, ...action.patch } : s
        ),
      };

    case "DELETE_SEGMENT":
      return {
        ...state,
        segments: state.segments.filter((s) => s.id !== action.id),
      };

    case "ADD_COMMON_SEGMENTS": {
      const existing = new Set(state.segments.map((s) => s.name.toLowerCase()));
      const newSegs = COMMON_SEGMENTS
        .filter((n) => !existing.has(n.toLowerCase()))
        .map((n) => ({
          id: uuid(),
          name: n,
          code: n.slice(0, 3).toUpperCase(),
        }));
      return { ...state, segments: [...state.segments, ...newSegs] };
    }

    case "ADD_COLLATERAL":
      return {
        ...state,
        collateral: [
          ...state.collateral,
          { id: uuid(), name: "", haircut: 0, ttr: 0 },
        ],
      };

    case "UPDATE_COLLATERAL":
      return {
        ...state,
        collateral: state.collateral.map((c) =>
          c.id === action.id ? { ...c, ...action.patch } : c
        ),
      };

    case "DELETE_COLLATERAL":
      return {
        ...state,
        collateral: state.collateral.filter((c) => c.id !== action.id),
      };

    case "ADD_COMMON_COLLATERAL": {
      const existing = new Set(state.collateral.map((c) => c.name.toLowerCase()));
      const newCol = COMMON_COLLATERAL
        .filter(([n]) => !existing.has(n.toLowerCase()))
        .map(([name, haircut, ttr]) => ({
          id: uuid(),
          name,
          haircut: haircut as number,
          ttr: ttr as number,
        }));
      return { ...state, collateral: [...state.collateral, ...newCol] };
    }

    case "ADD_INVITE":
      if (
        state.invites.some(
          (i) => i.email.toLowerCase() === action.entry.email.toLowerCase()
        )
      ) {
        return state;
      }
      return { ...state, invites: [...state.invites, action.entry] };

    case "DELETE_INVITE":
      return {
        ...state,
        invites: state.invites.filter(
          (i) => i.email.toLowerCase() !== action.email.toLowerCase()
        ),
      };

    case "OPEN_SKIP_MODAL":
      return { ...state, skipModalOpen: true };

    case "OPEN_REQUIRED_MODAL":
      return { ...state, requiredModalOpen: true };

    case "CLOSE_MODAL":
      return { ...state, skipModalOpen: false, requiredModalOpen: false };

    case "FINISH_DONE":
      return {
        ...state,
        step: "done",
        skipModalOpen: false,
        requiredModalOpen: false,
        doneVariant: action.variant,
      };

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────────

interface WizardContextValue {
  state: WizardState;
  dispatch: Dispatch<WizardAction>;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({
  children,
  initialName = "",
}: {
  children: React.ReactNode;
  initialName?: string;
}) {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    profile: { ...defaultState.profile, institutionName: initialName },
  });

  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
}

// ── Validation helpers ─────────────────────────────────────────────────────

export function isStepValid(state: WizardState, step: WizardStep): boolean {
  if (step === "welcome" || step === "done") return true;

  if (step === 0) {
    return state.profile.institutionName.trim().length >= 2;
  }

  if (step === 1) {
    if (state.segments.length === 0) return false;
    const names = state.segments.map((s) => s.name.trim().toLowerCase());
    const hasBlank = state.segments.some((s) => !s.name.trim());
    const hasDupe = names.some((n, i) => n && names.indexOf(n) !== i);
    return !hasBlank && !hasDupe;
  }

  if (step === 2) {
    if (state.collateral.length === 0) return false;
    const hasBlank = state.collateral.some((c) => !c.name.trim());
    const hasInvalidHaircut = state.collateral.some(
      (c) => isNaN(c.haircut) || c.haircut < 0 || c.haircut > 100
    );
    const hasInvalidTtr = state.collateral.some(
      (c) => isNaN(c.ttr) || c.ttr < 0
    );
    const names = state.collateral.map((c) => c.name.trim().toLowerCase());
    const hasDupe = names.some((n, i) => n && names.indexOf(n) !== i);
    return !hasBlank && !hasInvalidHaircut && !hasInvalidTtr && !hasDupe;
  }

  if (step === 3) return true; // optional

  if (step === 4) {
    return state.segments.length >= 1 && state.collateral.length >= 1;
  }

  return true;
}

export function getStepHint(step: WizardStep): string {
  if (step === 0) return "Enter your institution name to continue";
  if (step === 1) return "Add at least one segment with a unique name";
  if (step === 2) return "Add at least one collateral type with valid haircut and time-to-realize";
  if (step === 4) return "Complete required steps — segments and collateral are needed";
  return "";
}
