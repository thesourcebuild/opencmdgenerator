"use client";

import type { ReactNode } from "react";
import type { IfconfigPlatform } from "@cmdgen/ifconfig";
import { Panel, cn } from "@cmdgen/ui";

export const isWindows = (p: IfconfigPlatform) =>
  p === "windows-cmd" ||
  p === "windows-powershell" ||
  p === "windows-cygwin" ||
  p === "windows-msys" ||
  p === "windows-wsl";

/**
 * Same shape as `@cmdgen/mkdir`'s `MkdirTargetSelector`, but the Windows
 * button defaults to `"windows-cmd"` rather than `"windows-powershell"` —
 * `ipconfig.exe` renders identically either way (see `render.ts`'s single
 * `quoteForPlatform` dispatch and the collapsed sub-picker entry in
 * `IfconfigPreview`), so which windows value gets stored is arbitrary;
 * cmd.exe is the more traditional home for ipconfig, so it's the one picked.
 * windows-cygwin/windows-msys/windows-wsl behave nothing like ipconfig (real
 * ifconfig, real POSIX flags), but still count as "Windows" here since the
 * platform is still Windows — `IfconfigPreview`'s own sub-picker is where
 * the user actually distinguishes among the five Windows values.
 */
export function IfconfigTargetSelector({
  value,
  onChange,
}: {
  value: IfconfigPlatform;
  onChange: (next: IfconfigPlatform) => void;
}) {
  return (
    <Panel title="Target platform" description="Determines available flags.">
      <div className="flex flex-wrap gap-1">
        {(
          [
            ["linux", "Linux"],
            ["mac", "Mac"],
          ] as [IfconfigPlatform, string][]
        ).map(([platform, label]) => (
          <PlatformButton key={platform} active={value === platform} onClick={() => onChange(platform)}>
            {label}
          </PlatformButton>
        ))}
        <PlatformButton active={isWindows(value)} onClick={() => (isWindows(value) ? undefined : onChange("windows-cmd"))}>
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
