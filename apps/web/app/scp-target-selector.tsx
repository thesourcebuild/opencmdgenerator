"use client";

import { useState, type ReactNode } from "react";
import type { PathFlavor, ShellDialect } from "@cmdgen/scp";
import { Panel, cn } from "@cmdgen/ui";

/** Same role and shape as `RsyncTargetSelector` — see its doc comment, including the Linux/Mac local-state trick. Kept as its own component purely because scp's build/shell mapping is its own type. */
export type ScpPlatform =
  | "posix"
  | "windows-cmd"
  | "windows-powershell"
  | "windows-cygwin"
  | "windows-msys"
  | "windows-wsl";

export type ScpWindowsPlatform = Exclude<ScpPlatform, "posix">;

const WINDOWS_TO_SHELL: Record<ScpWindowsPlatform, ShellDialect> = {
  "windows-cmd": "cmd",
  "windows-powershell": "powershell",
  "windows-cygwin": "cygwin",
  "windows-msys": "msys",
  "windows-wsl": "posix",
};

const WINDOWS_TO_FLAVOR: Record<ScpWindowsPlatform, PathFlavor> = {
  "windows-cmd": "cygwin",
  "windows-powershell": "cygwin",
  "windows-cygwin": "cygwin",
  "windows-msys": "msys",
  "windows-wsl": "wsl",
};

export function scpPlatformOf(shell: ShellDialect, pathFlavor: PathFlavor): ScpPlatform {
  if (shell === "cmd") return "windows-cmd";
  if (shell === "powershell") return "windows-powershell";
  if (shell === "cygwin") return "windows-cygwin";
  if (shell === "msys") return "windows-msys";
  return pathFlavor === "wsl" ? "windows-wsl" : "posix";
}

export function scpPlatformToShellAndFlavor(platform: ScpPlatform): { shell: ShellDialect; pathFlavor: PathFlavor } {
  if (platform === "posix") return { shell: "posix", pathFlavor: "unix" };
  return { shell: WINDOWS_TO_SHELL[platform], pathFlavor: WINDOWS_TO_FLAVOR[platform] };
}

export const isWindows = (p: ScpPlatform) => p !== "posix";

export function ScpTargetSelector({ value, onChange }: { value: ScpPlatform; onChange: (next: ScpPlatform) => void }) {
  const [posixOs, setPosixOs] = useState<"linux" | "mac">("linux");
  const windows = isWindows(value);
  return (
    <Panel title="Target platform" description="Determines available flags and path spelling.">
      <div className="flex flex-wrap gap-1">
        <PlatformButton
          active={!windows && posixOs === "linux"}
          onClick={() => {
            setPosixOs("linux");
            onChange("posix");
          }}
        >
          Linux
        </PlatformButton>
        <PlatformButton
          active={!windows && posixOs === "mac"}
          onClick={() => {
            setPosixOs("mac");
            onChange("posix");
          }}
        >
          Mac
        </PlatformButton>
        <PlatformButton active={windows} onClick={() => (windows ? undefined : onChange("windows-powershell"))}>
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
