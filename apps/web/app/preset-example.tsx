"use client";

import type { Preset } from "@cmdgen/engine";
import { Panel } from "@cmdgen/ui";

/**
 * The first persistent, visible home for `Preset.summary` — previously it
 * only ever showed as a browser tooltip on a disabled dropdown `<option>`.
 * Generic over `TSpec` (same pattern as `DiagnosticsPanel`); needs nothing
 * command-specific beyond whichever preset was last picked.
 *
 * `mnemonic`/`commandExample`/`howItWorks`/`useCase` are optional and rendered
 * only when a preset sets them — most presets need nothing beyond `summary`,
 * so this degrades to the original plain label+summary display for
 * everything else.
 */
export function PresetInfo<TSpec>({ preset }: { preset: Preset<TSpec> | null }) {
  return (
    <Panel title="Example" collapsible defaultOpen>
      {preset ? (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold">{preset.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{preset.summary}</p>
            {preset.mnemonic && (
              <p className="mt-1.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                Mnemonic: {preset.mnemonic}
              </p>
            )}
          </div>

          {preset.commandExample && (
            <pre className="overflow-x-auto rounded-md bg-slate-50 p-2 font-mono text-[11px] leading-relaxed dark:bg-slate-950">
              {preset.commandExample}
            </pre>
          )}

          {preset.howItWorks && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">How it works</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{preset.howItWorks}</p>
            </div>
          )}

          {preset.useCase && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Primary use case</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{preset.useCase}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-400">Pick a preset from the panel on the right to see it explained here.</p>
      )}
    </Panel>
  );
}
