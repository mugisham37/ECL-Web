"use client";

import { createContext, useContext, useReducer, type Dispatch } from "react";
import type { Tenant } from "@/lib/dashboard-types";

// ── State ──────────────────────────────────────────────────────────────────

interface DashboardShellState {
  isCollapsed: boolean;
  isMobileDrawerOpen: boolean;
  activeTenant: Tenant | null;
}

const initialState: DashboardShellState = {
  isCollapsed: false,
  isMobileDrawerOpen: false,
  activeTenant: null,
};

// ── Actions ────────────────────────────────────────────────────────────────

type DashboardShellAction =
  | { type: "TOGGLE_COLLAPSE" }
  | { type: "SET_COLLAPSED"; value: boolean }
  | { type: "OPEN_MOBILE_DRAWER" }
  | { type: "CLOSE_MOBILE_DRAWER" }
  | { type: "SET_TENANT"; tenant: Tenant };

function reducer(
  state: DashboardShellState,
  action: DashboardShellAction
): DashboardShellState {
  switch (action.type) {
    case "TOGGLE_COLLAPSE":
      return { ...state, isCollapsed: !state.isCollapsed };
    case "SET_COLLAPSED":
      return { ...state, isCollapsed: action.value };
    case "OPEN_MOBILE_DRAWER":
      return { ...state, isMobileDrawerOpen: true };
    case "CLOSE_MOBILE_DRAWER":
      return { ...state, isMobileDrawerOpen: false };
    case "SET_TENANT":
      return { ...state, activeTenant: action.tenant };
    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────────

interface DashboardContextValue {
  state: DashboardShellState;
  dispatch: Dispatch<DashboardShellAction>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({
  children,
  defaultTenant,
}: {
  children: React.ReactNode;
  defaultTenant?: Tenant;
}) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    activeTenant: defaultTenant ?? null,
  });

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
}
