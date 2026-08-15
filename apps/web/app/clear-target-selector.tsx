"use client";

import type { ReactNode } from "react";
import type { ClearPlatform } from "@cmdgen/clear";
import { Panel, cn } from "@cmdgen/ui";

export const isWindows = (p: ClearPlatform) =>
  p === "windows-cmd" || p === "windows-powershell" || p === "windows-cygwin" || p === "windows-msys" || p === "windows-wsl";

/** Same shape as `@cmdgen/mv`'s `MvTargetSelector`. */
export function ClearTargetSelector({ value, onChange }: { value: ClearPlatform; onChange: (next: ClearPlatform) => void }) {
  return (
    <Panel title="Target platform" description="Determines available flags.">
      <div className="flex flex-wrap gap-1">
        {(
          [
            ["linux", "Linux"],
            ["mac", "Mac"],
          ] as [ClearPlatform, string][]
        ).map(([platform, label]) => (
          <PlatformButton key={platform} active={value === platform} onClick={() => onChange(platform)}>
            {label}
          </PlatformButton>
        ))}
        <PlatformButton active={isWindows(value)} onClick={() => (isWindows(value) ? undefined : onChange("windows-powershell"))}>
          Windows
        </PlatformButton>
      </div>
    </Panel>
  );
}

function PlatformButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded px-2 py-1 text-xs transition-colors",
        active
          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
      )}
    >
      {children}
    </button>
  );
}
