"use client";

import type { ModeAuthoring, OctalBits, OctalMode } from "@cmdgen/chmod";
import { emptyOctalMode, formatOctalMode, parseOctalMode } from "@cmdgen/chmod";
import { Panel, cn } from "@cmdgen/ui";

type OctalClass = "owner" | "group" | "other";

const CLASSES: readonly [OctalClass, string][] = [
  ["owner", "Owner"],
  ["group", "Group"],
  ["other", "Other"],
];

const PERMS: readonly [keyof OctalBits, string][] = [
  ["read", "r"],
  ["write", "w"],
  ["execute", "x"],
];

export interface ModeEditorProps {
  mode: string;
  authoring: ModeAuthoring;
  onModeChange: (mode: string) => void;
  onAuthoringChange: (authoring: ModeAuthoring) => void;
}

/**
 * chmod's MODE builder — a real grammar, not a flag, so it gets a real
 * editor instead of a bare text box. `spec.mode` (a plain string) stays the
 * single source of truth; the octal grid is only ever a *view* over it,
 * reconstructed via `parseOctalMode` each render (falling back to an empty
 * grid whenever the current text isn't valid octal, e.g. while a symbolic
 * expression is in `mode`) rather than tracked as separate UI state that
 * could drift out of sync.
 */
export function ModeEditor({ mode, authoring, onModeChange, onAuthoringChange }: ModeEditorProps) {
  const octal = parseOctalMode(mode) ?? emptyOctalMode();

  const setBit = (cls: OctalClass, perm: keyof OctalBits, value: boolean) => {
    const next: OctalMode = { ...octal, [cls]: { ...octal[cls], [perm]: value } };
    onModeChange(formatOctalMode(next));
  };

  const setSpecial = (key: "setuid" | "setgid" | "sticky", value: boolean) => {
    onModeChange(formatOctalMode({ ...octal, [key]: value }));
  };

  return (
    <Panel title="Mode" description="What permission bits to set — or --reference an existing file instead.">
      <div className="mb-3 flex gap-1">
        {(["octal", "symbolic"] as const).map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => onAuthoringChange(choice)}
            className={cn(
              "rounded px-2 py-1 text-xs capitalize transition-colors",
              authoring === choice
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
            )}
          >
            {choice}
          </button>
        ))}
      </div>

      {authoring === "octal" ? (
        <div className="space-y-3">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left font-medium" />
                {PERMS.map(([, label]) => (
                  <th key={label} className="px-2 text-center font-mono font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CLASSES.map(([cls, label]) => (
                <tr key={cls}>
                  <td className="py-1 font-medium">{label}</td>
                  {PERMS.map(([perm]) => (
                    <td key={perm} className="text-center">
                      <input
                        type="checkbox"
                        checked={octal[cls][perm]}
                        onChange={(e) => setBit(cls, perm, e.target.checked)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-wrap gap-3 text-xs">
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={octal.setuid} onChange={(e) => setSpecial("setuid", e.target.checked)} />
              setuid
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={octal.setgid} onChange={(e) => setSpecial("setgid", e.target.checked)} />
              setgid
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={octal.sticky} onChange={(e) => setSpecial("sticky", e.target.checked)} />
              sticky
            </label>
          </div>

          <pre className="rounded-md bg-slate-50 p-2 font-mono text-[11px] dark:bg-slate-950">
            {mode.trim() === "" ? "(no mode set)" : mode}
          </pre>
        </div>
      ) : (
        <input
          value={mode}
          onChange={(e) => onModeChange(e.target.value)}
          placeholder="a+x, u=rwx,go=rx, +110, ..."
          className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
        />
      )}
    </Panel>
  );
}
