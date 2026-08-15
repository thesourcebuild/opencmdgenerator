"use client";

import type { ReactNode } from "react";
import type { TraceroutePlatform } from "@cmdgen/traceroute";
import { Panel, cn } from "@cmdgen/ui";

export const isWindows = (p: TraceroutePlatform) =>
  p === "windows-cmd" || p === "windows-powershell" || p === "windows-cygwin" || p === "windows-msys" || p === "windows-wsl";

/**
 * Same 3-button Linux/Mac/Windows layout as `@cmdgen/mkdir`'s
 * `MkdirTargetSelector`, but the Windows button defaults its first click to
 * "windows-cmd" (tracert is thought of as a cmd.exe tool primarily) rather
 * than "windows-powershell" — the sub-choice among windows-cmd/
 * windows-powershell/windows-cygwin/windows-msys/windows-wsl itself lives in
 * the Generated Command panel's shell picker (see `TraceroutePreview`), same
 * as mkdir's.
 */
export function TracerouteTargetSelector({
  value,
  onChange,
}: {
  value: TraceroutePlatform;
  onChange: (next: TraceroutePlatform) => void;
}) {
  return (
    <Panel title="Target platform" description="Determines available flags.">
      <div className="flex flex-wrap gap-1">
        {(
          [
            ["linux", "Linux"],
            ["mac", "Mac"],
          ] as [TraceroutePlatform, string][]
        ).map(([platform, label]) => (
          <PlatformButton key={platform} active={value === platform} onClick={() => onChange(platform)}>
            {label}
          </PlatformButton>
        ))}
        <PlatformButton
          active={isWindows(value)}
          onClick={() => (isWindows(value) ? undefined : onChange("windows-cmd"))}
        >
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
