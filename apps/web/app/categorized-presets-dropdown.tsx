"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";

export interface CategorizedPresetsDropdownProps<TSpec> {
  presets: readonly Preset<TSpec>[];
  spec: TSpec;
  onApply: (next: TSpec) => void;
  /** Reports which preset was just picked, so a caller can show it elsewhere (e.g. the Example section) — separate from `onApply`, which only sees the resulting spec. */
  onSelectPreset?: (preset: Preset<TSpec>) => void;
}

const UNCATEGORIZED = "Common requests";

/**
 * Two-step preset picker: a Category dropdown narrows the second Preset
 * dropdown to just that category's entries. Used by any command with enough
 * presets (curl's httpbingo.org endpoints, git's 10 subcommand categories)
 * that a single flat list stops being scannable — commands with only a
 * handful of presets still use the plain `PresetsDropdown`.
 * Examples with no `category` fall into "Common requests" so presets
 * predating this component need no changes to keep working.
 */
export function CategorizedPresetsDropdown<TSpec>({ presets, spec, onApply, onSelectPreset }: CategorizedPresetsDropdownProps<TSpec>) {
  const categories = Array.from(new Set(presets.map((p) => p.category ?? UNCATEGORIZED)));
  const [category, setCategory] = useState(categories[0] ?? UNCATEGORIZED);
  const [selectedId, setSelectedId] = useState("");

  const inCategory = presets.filter((p) => (p.category ?? UNCATEGORIZED) === category);

  return (
    <div className="space-y-2">
      <div>
        <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">Category</label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSelectedId("");
          }}
          className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">Preset</label>
        <select
          value={selectedId}
          onChange={(e) => {
            const preset = presets.find((p) => p.id === e.target.value);
            if (preset) {
              onApply(preset.apply(spec));
              setSelectedId(preset.id);
              onSelectPreset?.(preset);
            }
          }}
          className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
        >
          <option value="" disabled>
            Choose a preset…
          </option>
          {inCategory.map((preset) => {
            const applicable = preset.isApplicable ? preset.isApplicable(spec) : true;
            return (
              <option key={preset.id} value={preset.id} disabled={!applicable} title={preset.summary}>
                {preset.label}
                {applicable ? "" : " (unavailable)"}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
