"use client";

import { useEffect, useState, type ReactNode } from "react";
import { platform } from "@cmdgen/platform";
import { cn } from "@cmdgen/ui";

export interface SidebarTab {
  id: string;
  label: string;
  content: ReactNode;
}

interface BookmarkSource<TSpec> {
  commandId: string;
  spec: TSpec;
  onApply: (spec: TSpec) => void;
}

interface StoredBookmark {
  id: string;
  name: string;
  description: string;
  tags: string[];
  commandId: string;
  spec: unknown;
  createdAt: number;
  updatedAt: number;
}

interface BookmarkStore {
  storeVersion: 1;
  profiles: StoredBookmark[];
}

const BOOKMARK_TAG = "bookmark";
const PENDING_BOOKMARK_KEY = "OpenCmdGenerator:pendingBookmark:v1";
const SELECT_COMMAND_EVENT = "OpenCmdGenerator:selectCommand";

function emptyStore(): BookmarkStore {
  return { storeVersion: 1, profiles: [] };
}

function parseStore(raw: string | undefined): BookmarkStore {
  if (!raw) return emptyStore();
  try {
    const parsed = JSON.parse(raw) as Partial<BookmarkStore>;
    if (parsed.storeVersion !== 1 || !Array.isArray(parsed.profiles)) return emptyStore();
    return {
      storeVersion: 1,
      profiles: parsed.profiles.filter((profile): profile is StoredBookmark => typeof profile?.id === "string"),
    };
  } catch {
    return emptyStore();
  }
}

function isBookmark(profile: StoredBookmark): boolean {
  return Array.isArray(profile.tags) && profile.tags.includes(BOOKMARK_TAG);
}

function cloneSpec<TSpec>(spec: TSpec): TSpec {
  return JSON.parse(JSON.stringify(spec)) as TSpec;
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
export function RightSidebar<TSpec>({ tabs, bookmark }: { tabs: SidebarTab[]; bookmark?: BookmarkSource<TSpec> }) {
  const allTabs: SidebarTab[] = bookmark
    ? [...tabs, { id: "bookmark", label: "Bookmark", content: <BookmarkPanel source={bookmark} /> }]
    : tabs;
  const [activeId, setActiveId] = useState(allTabs[0]?.id);
  const [collapsed, setCollapsed] = useState(false);
  const active = allTabs.find((t) => t.id === activeId) ?? allTabs[0];

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
          {allTabs.map((tab) => (
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

function BookmarkPanel<TSpec>({ source }: { source: BookmarkSource<TSpec> }) {
  const [store, setStore] = useState<BookmarkStore>(() => emptyStore());
  const [name, setName] = useState(() => `${source.commandId} bookmark`);
  const [status, setStatus] = useState<string | undefined>(undefined);

  const bookmarks = store.profiles.filter(isBookmark);

  useEffect(() => {
    let cancelled = false;
    void platform()
      .readProfiles()
      .then((raw) => {
        if (!cancelled) setStore(parseStore(raw));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const raw = window.localStorage.getItem(PENDING_BOOKMARK_KEY);
    if (!raw) return;
    const pending = JSON.parse(raw) as StoredBookmark;
    if (pending.commandId !== source.commandId) return;
    source.onApply(pending.spec as TSpec);
    window.localStorage.removeItem(PENDING_BOOKMARK_KEY);
    setStatus(`Loaded ${pending.name}.`);
  }, [source]);

  async function writeStore(next: BookmarkStore): Promise<void> {
    setStore(next);
    await platform().writeProfiles(JSON.stringify(next));
  }

  async function saveCurrent(): Promise<void> {
    const now = Date.now();
    const trimmedName = name.trim() || `${source.commandId} bookmark`;
    const next: BookmarkStore = {
      storeVersion: 1,
      profiles: [
        ...store.profiles,
        {
          id: `bookmark-${now}-${Math.random().toString(36).slice(2, 8)}`,
          name: trimmedName,
          description: "",
          tags: [BOOKMARK_TAG],
          commandId: source.commandId,
          spec: cloneSpec(source.spec),
          createdAt: now,
          updatedAt: now,
        },
      ],
    };
    await writeStore(next);
    setStatus(`Saved ${trimmedName}.`);
  }

  function applyBookmark(bookmark: StoredBookmark): void {
    if (bookmark.commandId === source.commandId) {
      source.onApply(bookmark.spec as TSpec);
      setStatus(`Loaded ${bookmark.name}.`);
      return;
    }
    window.localStorage.setItem(PENDING_BOOKMARK_KEY, JSON.stringify(bookmark));
    window.dispatchEvent(new CustomEvent(SELECT_COMMAND_EVENT, { detail: { commandId: bookmark.commandId } }));
  }

  async function deleteBookmark(id: string): Promise<void> {
    await writeStore({ ...store, profiles: store.profiles.filter((profile) => profile.id !== id) });
    setStatus("Bookmark deleted.");
  }

  return (
    <div className="space-y-3 text-xs">
      <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <label className="mb-1 block font-medium text-slate-700 dark:text-slate-300">Bookmark name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
        />
        <button
          type="button"
          onClick={() => void saveCurrent()}
          className="mt-2 h-8 w-full rounded-md bg-slate-900 px-3 text-xs font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Save current spec
        </button>
        {status && <p className="mt-2 text-[11px] text-slate-400">{status}</p>}
      </div>

      <div className="space-y-2">
        {bookmarks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 p-3 text-center text-slate-400 dark:border-slate-800">
            No bookmarks saved yet.
          </p>
        ) : (
          bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              <p className="font-semibold text-slate-700 dark:text-slate-200">{bookmark.name}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{bookmark.commandId}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => applyBookmark(bookmark)}
                  className="h-7 flex-1 rounded-md border border-slate-300 bg-white px-2 text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Load
                </button>
                <button
                  type="button"
                  onClick={() => void deleteBookmark(bookmark.id)}
                  className="h-7 rounded-md px-2 text-[11px] font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
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
