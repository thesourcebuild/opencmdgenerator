"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@cmdgen/ui";
import { useTheme, type ThemePreference } from "./use-theme";

interface SettingsCategory {
  id: string;
  label: string;
  content: ReactNode;
}

const CATEGORIES: SettingsCategory[] = [{ id: "appearance", label: "Appearance", content: <AppearanceSettings /> }];

export interface SettingsOverlayProps {
  open: boolean;
  onClose: () => void;
}

/** A settings dialog in the Eclipse-preferences shape: a category list on the left, the selected category's settings on the right — rather than one long scrolling page. Only "Appearance" exists today; more categories are just more `CATEGORIES` entries. */
export function SettingsOverlay({ open, onClose }: SettingsOverlayProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORIES[0]!.id);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryId) ?? CATEGORIES[0]!;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      onClick={onClose}
    >
      <div
        className="flex h-[560px] w-full max-w-3xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <aside className="w-52 shrink-0 space-y-0.5 overflow-y-auto border-r border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950">
          <h2 className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Settings</h2>
          <nav className="space-y-0.5">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategoryId(category.id)}
                className={cn(
                  "block w-full rounded px-2 py-1.5 text-left text-sm transition-colors",
                  category.id === activeCategoryId
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800",
                )}
              >
                {category.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <h1 className="text-sm font-semibold">{activeCategory.label}</h1>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close settings"
              title="Close"
              className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <CloseIcon />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto p-4">{activeCategory.content}</div>
        </div>
      </div>
    </div>
  );
}

const THEME_OPTIONS: { id: ThemePreference; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
];

function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h3 className="mb-1 text-xs font-medium text-slate-700 dark:text-slate-300">Theme</h3>
      <p className="mb-2 text-xs text-slate-400">Controls the color scheme of the app. "System" follows your OS setting.</p>
      <div className="flex gap-1">
        {THEME_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setTheme(option.id)}
            className={cn(
              "rounded px-3 py-1.5 text-xs transition-colors",
              theme === option.id
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
