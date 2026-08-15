"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";

export interface PresetsDropdownProps<TSpec> {
  presets: readonly Preset<TSpec>[];
  spec: TSpec;
  onApply: (next: TSpec) => void;
  /** Reports which preset was just picked, so a caller can show it elsewhere (e.g. the Example section) — separate from `onApply`, which only sees the resulting spec. */
  onSelectPreset?: (preset: Preset<TSpec>) => void;
}

/**
 * Shows whichever preset was picked last, rather than resetting to the
 * placeholder — the dropdown itself is the confirmation that something was
 * applied. The tradeoff: since this makes it a normal controlled select,
 * picking the SAME preset twice in a row only re-applies it the first time —
 * the second pick is not a value change, so the browser fires no change
 * event. Re-picking a different preset in between works as expected.
 */
export function PresetsDropdown<TSpec>({ presets, spec, onApply, onSelectPreset }: PresetsDropdownProps<TSpec>) {
  const [selectedId, setSelectedId] = useState("");

  return (
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
      {presets.map((preset) => {
        const applicable = preset.isApplicable ? preset.isApplicable(spec) : true;
        return (
          <option key={preset.id} value={preset.id} disabled={!applicable} title={preset.summary}>
            {preset.label}
            {applicable ? "" : " (unavailable)"}
          </option>
        );
      })}
    </select>
  );
}
