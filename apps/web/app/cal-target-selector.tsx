"use client";

import type { CalPlatform } from "@cmdgen/cal";
import { Panel, cn } from "@cmdgen/ui";

/**
 * Only 2 buttons, unlike every other target selector in this app — `cal` has
 * no Windows story at all (see `CalPlatform`'s own comment). This axis exists
 * purely to gate which flags are offered (Linux's `-m` vs macOS's lack of a
 * Monday-first flag), not to change quoting or the binary name.
 */
export function CalTargetSelector({ value, onChange }: { value: CalPlatform; onChange: (next: CalPlatform) => void }) {
  return (
    <Panel title="Target platform" description="Determines available flags.">
      <div className="flex flex-wrap gap-1">
        {(
          [
            ["linux", "Linux"],
            ["mac", "Mac"],
          ] as [CalPlatform, string][]
        ).map(([platform, label]) => (
          <button
            key={platform}
            type="button"
            onClick={() => onChange(platform)}
            className={cn(
              "rounded px-2 py-1 text-xs transition-colors",
              value === platform
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </Panel>
  );
}
