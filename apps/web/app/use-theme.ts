"use client";

import { useCallback, useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "./theme-constants";

export type ThemePreference = "light" | "dark" | "system";

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function readStoredTheme(): ThemePreference {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(raw) ? raw : "system";
  } catch {
    return "system";
  }
}

function applyTheme(pref: ThemePreference) {
  const dark = pref === "dark" || (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

/**
 * Manual light/dark/system theme control. "system" follows the OS preference
 * live; "light"/"dark" pin the `.dark` class regardless of the OS setting.
 * Persisted to localStorage. The `.dark` class is also set synchronously by
 * an inline script in `layout.tsx` before hydration, so there's no flash of
 * the wrong theme on load — this hook only needs to pick up the already-correct
 * value and keep it in sync with "system" mode's live OS changes.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemePreference>(() =>
    typeof window === "undefined" ? "system" : readStoredTheme(),
  );

  useEffect(() => {
    applyTheme(theme);
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private browsing modes can throw on localStorage access — theme just won't persist.
    }
  }, []);

  return { theme, setTheme };
}
