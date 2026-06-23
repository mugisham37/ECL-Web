"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

const STORAGE_KEY = "theme";
const THEMES = ["light", "dark"] as const;

interface ThemeContextValue {
  theme?: string;
  setTheme: Dispatch<SetStateAction<string>>;
  resolvedTheme?: string;
  themes: string[];
  forcedTheme?: string;
  systemTheme?: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({
  setTheme: () => {},
  themes: [...THEMES],
});

function applyTheme(theme: string) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme === "dark" ? "dark" : "light";
}

function disableTransitions() {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}",
    ),
  );
  document.head.appendChild(style);
  window.getComputedStyle(document.body);
  return () => {
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1);
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || "light";
      setThemeState(saved);
      applyTheme(saved);
    } catch {
      setThemeState("light");
      applyTheme("light");
    }
  }, []);

  const setTheme = useCallback<Dispatch<SetStateAction<string>>>((value) => {
    const removeTransitions = disableTransitions();
    setThemeState((prev) => {
      const next = typeof value === "function" ? value(prev ?? "light") : value;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // storage unavailable
      }
      applyTheme(next);
      return next;
    });
    removeTransitions();
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme: theme,
      themes: [...THEMES],
    }),
    [theme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
