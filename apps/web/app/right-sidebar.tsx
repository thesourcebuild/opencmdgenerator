"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@cmdgen/ui";

export interface SidebarTab {
  id: string;
  label: string;
  content: ReactNode;
}

/**
 * Right-hand rail: presets, target selection, and diagnostics — the "meta"
 * controls for the command being built, separate from its actual inputs
 * (which live in the main column). Tabbed so a future command can add a
 * second tab (e.g. saved profiles) without a layout change; only one tab
 * exists today.
 *
 * `sticky` (not a true layout sibling of `<main>`, since it's rendered inside
 * each builder's own scrolling column) — `self-start` stops it stretching to
 * the main column's full height, which is what lets it detach from normal
 * flow and stay put like the left sidebar does, instead of scrolling away
 * with the (usually much taller) command panels next to it.
 */
export function RightSidebar({ tabs }: { tabs: SidebarTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const [collapsed, setCollapsed] = useState(false);
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  if (collapsed) {
    return (
      <div className="sticky top-6 flex w-11 shrink-0 self-start flex-col items-center pt-1">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          title="Expand sidebar"
          className="rounded-md border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <ExpandIcon />
        </button>
      </div>
    );
  }

  return (
    <div className="sticky top-6 max-h-[calc(100vh-6rem)] w-72 shrink-0 self-start space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveId(tab.id)}
              className={cn(
                "-mb-px border-b-2 px-3 py-2 text-xs font-medium transition-colors",
                tab.id === active?.id
                  ? "border-slate-900 text-slate-900 dark:border-slate-100 dark:text-slate-100"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
          className="mb-1 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <CollapseIcon />
        </button>
      </div>

      <div className="space-y-4">{active?.content}</div>
    </div>
  );
}

function ExpandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M15 4v16" />
      <path d="m10 12-3-3" />
      <path d="m10 12-3 3" />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M15 4v16" />
      <path d="m10 12 3-3" />
      <path d="m10 12 3 3" />
    </svg>
  );
}
