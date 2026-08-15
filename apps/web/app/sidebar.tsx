"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CommandManifest } from "@cmdgen/engine";
import { cn } from "@cmdgen/ui";

export interface SidebarProps {
  manifests: readonly CommandManifest[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCollapse: () => void;
}

const CATEGORY_STYLE: Record<string, string> = {
  "File Transfer": "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300",
  Shell: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Network: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300",
  Archive: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  "Version Control": "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300",
  Media: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
  Cryptography: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300",
};

function categoryStyle(category: string): string {
  return (
    CATEGORY_STYLE[category] ??
    "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
  );
}

/**
 * Left sidebar: search, category filter, and an alphabetically-grouped,
 * collapsible command list — sourced from `@cmdgen/registry`'s `MANIFESTS`
 * (passed in by the caller), so it works for however many commands are
 * installed without any change here.
 */
export function Sidebar({ manifests, selectedId, onSelect, onCollapse }: SidebarProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [collapsedLetters, setCollapsedLetters] = useState<Set<string>>(new Set());
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!categoryMenuRef.current?.contains(event.target as Node)) setCategoryMenuOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setCategoryMenuOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const categories = useMemo(
    () => [...new Set(manifests.map((m) => m.category))].sort(),
    [manifests],
  );

  const filtered = useMemo(() => {
    let list = [...manifests];
    if (activeCategory) list = list.filter((m) => m.category === activeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.label.toLowerCase().includes(q) ||
          m.summary.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }
    return list.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
  }, [manifests, search, activeCategory]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandManifest[]>();
    for (const m of filtered) {
      const letter = (m.label[0] ?? "#").toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(m);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const toggleLetter = (letter: string) =>
    setCollapsedLetters((prev) => {
      const next = new Set(prev);
      if (next.has(letter)) next.delete(letter);
      else next.add(letter);
      return next;
    });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2.5 dark:border-slate-800">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Command
          </p>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Browse the command library</p>
        </div>
        <button
          type="button"
          onClick={onCollapse}
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
          className="rounded-md border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <CollapseIcon />
        </button>
      </div>

      <div className="border-b border-slate-200 p-3 dark:border-slate-800">
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commands…"
            className="h-8 w-full rounded-md border border-slate-300 bg-white pl-8 pr-7 text-xs dark:border-slate-700 dark:bg-slate-950"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              title="Clear search"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <ClearIcon />
            </button>
          )}
        </div>
      </div>

      <div ref={categoryMenuRef} className="border-b border-slate-200 p-3 dark:border-slate-800">
        <p className="mb-2 text-sm font-semibold">Categories</p>
        <div className="relative">
          <button
            type="button"
            onClick={() => setCategoryMenuOpen((o) => !o)}
            aria-expanded={categoryMenuOpen}
            aria-haspopup="listbox"
            className="flex w-full items-center justify-between rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-left text-xs dark:border-slate-700 dark:bg-slate-950"
          >
            {activeCategory ? (
              <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", categoryStyle(activeCategory))}>
                {activeCategory}
              </span>
            ) : (
              <span className="font-medium">All categories</span>
            )}
            <ChevronIcon collapsed={!categoryMenuOpen} />
          </button>

          {categoryMenuOpen && (
            <div className="absolute left-0 right-0 z-10 mt-1 max-h-64 overflow-y-auto rounded-md border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory(null);
                  setCategoryMenuOpen(false);
                }}
                className={cn(
                  "block w-full rounded px-2 py-1.5 text-left text-xs",
                  activeCategory === null
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                All categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setCategoryMenuOpen(false);
                  }}
                  className={cn(
                    "mt-0.5 block w-full rounded px-2 py-1.5 text-left text-xs",
                    activeCategory === cat
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {groups.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-slate-400">No commands found</p>
        ) : (
          groups.map(([letter, items]) => {
            const isCollapsed = collapsedLetters.has(letter);
            return (
              <div key={letter}>
                <button
                  type="button"
                  onClick={() => toggleLetter(letter)}
                  className="flex w-full items-center gap-2 bg-slate-100 px-3 py-1 text-left dark:bg-slate-800/60"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-700 text-[10px] font-bold text-white dark:bg-slate-600">
                    {letter}
                  </span>
                  <span className="flex-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {items.length} {items.length === 1 ? "command" : "commands"}
                  </span>
                  <ChevronIcon collapsed={isCollapsed} />
                </button>

                {!isCollapsed && (
                  <div className="flex flex-col gap-0.5 p-1.5">
                    {items.map((m) => {
                      const active = m.id === selectedId;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => onSelect(m.id)}
                          className={cn(
                            "w-full rounded-md px-2 py-1.5 text-left transition-colors",
                            active
                              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                              : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-xs font-semibold">{m.label}</span>
                            <span
                              className={cn(
                                "shrink-0 rounded-full border px-1.5 py-px text-[9px] font-medium",
                                active ? "border-white/30 text-white/90" : categoryStyle(m.category),
                              )}
                            >
                              {m.category}
                            </span>
                          </div>
                          <p
                            className={cn(
                              "mt-0.5 truncate text-[11px]",
                              active ? "text-slate-300 dark:text-slate-600" : "text-slate-400",
                            )}
                          >
                            {m.summary}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-slate-200 px-3 py-2 text-center text-[11px] text-slate-400 dark:border-slate-800">
        {filtered.length === manifests.length
          ? `${manifests.length} commands`
          : `${filtered.length} of ${manifests.length} commands`}
      </div>
    </div>
  );
}

function CollapseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
      <path d="m14 12 3-3" />
      <path d="m14 12 3 3" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0 text-slate-400 transition-transform", collapsed ? "-rotate-90" : "")}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
