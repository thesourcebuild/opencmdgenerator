"use client";

import { useState, type ReactNode } from "react";
import type { PathFlavor, ShellDialect } from "@cmdgen/rsync";
import { Panel, cn } from "@cmdgen/ui";

/**
 * Unifies rsync's two independently-real axes — `PathFlavor` (which rsync
 * build is installed, controls path spelling) and `ShellDialect` (which
 * shell the command is typed into, controls quoting) — into the same
 * Linux/Mac/Windows "Target platform" shape every other command uses.
 * Picking a Windows sub-choice sets both axes together (e.g. "Cygwin" means
 * cwRsync is installed AND the command is typed into Cygwin's bash), trading
 * away the ability to mix-and-match (e.g. cwRsync installed but typed from
 * raw PowerShell) for one consistent picker. Linux/Mac/Windows, the same
 * 3-button shape every other command's target selector uses — rsync's own
 * `PathFlavor`/`ShellDialect` have no separate "mac" value ("unix"/"posix"
 * cover both), so Linux and Mac both set the identical `posix` value here;
 * which stays highlighted is local, cosmetic-only state, not derived from
 * `value` (which cannot tell them apart).
 */
export type RsyncPlatform =
  | "posix"
  | "windows-cmd"
  | "windows-powershell"
  | "windows-cygwin"
  | "windows-msys"
  | "windows-wsl";

export type RsyncWindowsPlatform = Exclude<RsyncPlatform, "posix">;

const WINDOWS_TO_SHELL: Record<RsyncWindowsPlatform, ShellDialect> = {
  "windows-cmd": "cmd",
  "windows-powershell": "powershell",
  "windows-cygwin": "cygwin",
  "windows-msys": "msys",
  "windows-wsl": "posix",
};

const WINDOWS_TO_FLAVOR: Record<RsyncWindowsPlatform, PathFlavor> = {
  "windows-cmd": "cygwin",
  "windows-powershell": "cygwin",
  "windows-cygwin": "cygwin",
  "windows-msys": "msys",
  "windows-wsl": "wsl",
};

/** Shell alone fully determines the Windows sub-choice (cmd/powershell/cygwin/msys are each a distinct shell); only the posix/WSL split needs `pathFlavor` too, since both quote identically. */
export function rsyncPlatformOf(shell: ShellDialect, pathFlavor: PathFlavor): RsyncPlatform {
  if (shell === "cmd") return "windows-cmd";
  if (shell === "powershell") return "windows-powershell";
  if (shell === "cygwin") return "windows-cygwin";
  if (shell === "msys") return "windows-msys";
  return pathFlavor === "wsl" ? "windows-wsl" : "posix";
}

export function rsyncPlatformToShellAndFlavor(platform: RsyncPlatform): { shell: ShellDialect; pathFlavor: PathFlavor } {
  if (platform === "posix") return { shell: "posix", pathFlavor: "unix" };
  return { shell: WINDOWS_TO_SHELL[platform], pathFlavor: WINDOWS_TO_FLAVOR[platform] };
}

export const isWindows = (p: RsyncPlatform) => p !== "posix";

export function RsyncTargetSelector({ value, onChange }: { value: RsyncPlatform; onChange: (next: RsyncPlatform) => void }) {
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
