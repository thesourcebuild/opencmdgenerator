"use client";

import { useState, type ReactNode } from "react";
import type { ShellDialect } from "@cmdgen/engine";
import { Panel, cn } from "@cmdgen/ui";
import { PlatformSelect } from "./platform-select";

const WINDOWS_SHELLS: readonly ShellDialect[] = ["cmd", "powershell", "cygwin", "msys", "wsl"];

export const isWindowsShell = (shell: ShellDialect) => shell !== "posix";

export interface ShellDialectTargetSelectorProps {
  value: ShellDialect;
  onChange: (next: ShellDialect) => void;
}

/**
 * Sidebar "Target platform" panel shared by every command whose generated
 * output is a plain argv .exe that runs unchanged from any shell (ssh, tar,
 * curl, ...) — Linux/Mac/Windows, the same 3-button shape every other
 * command's own target selector uses. `ShellDialect` itself has no separate
 * "mac" value (posix covers both, same as it does for `LsPlatform` etc. even
 * though those DO carry distinct "linux"/"mac" enum values) — Linux and Mac
 * both set `shell: "posix"` here; which of the two stays highlighted is
 * tracked as local, cosmetic-only state, not derived from `value` (which
 * cannot tell them apart). Which Windows shell types the command
 * (cmd/powershell/cygwin/msys/wsl) is a second, Windows-only choice that lives
 * inline in the Generated Command panel instead — see `ShellQuotingSelect`
 * below, which shows that real choice for Windows and a disabled
 * "POSIX (bash/zsh)" placeholder otherwise, so the control's presence is
 * consistent regardless of which top-level button is active.
 */
export function ShellDialectTargetSelector({ value, onChange }: ShellDialectTargetSelectorProps) {
  const [posixOs, setPosixOs] = useState<"linux" | "mac">("linux");
  const isWindows = isWindowsShell(value);
  return (
    <Panel title="Target platform" description="Determines quoting. This command is a real executable, so its flags are identical everywhere.">
      <div className="flex flex-wrap gap-1">
        <PlatformButton
          active={!isWindows && posixOs === "linux"}
          onClick={() => {
            setPosixOs("linux");
            onChange("posix");
          }}
        >
          Linux
        </PlatformButton>
        <PlatformButton
          active={!isWindows && posixOs === "mac"}
          onClick={() => {
            setPosixOs("mac");
            onChange("posix");
          }}
        >
          Mac
        </PlatformButton>
        <PlatformButton active={isWindows} onClick={() => (isWindows ? undefined : onChange("powershell"))}>
          Windows
        </PlatformButton>
      </div>
    </Panel>
  );
}

export interface ShellQuotingSelectProps {
  value: ShellDialect;
  onChange: (next: ShellDialect) => void;
  title?: string;
}

/**
 * The shell-quoting control for the Generated Command panel's `extraActions`
 * — always rendered, unconditionally, so the control's presence does not
 * flicker in and out as the Target Platform buttons change. Shows the real
 * cmd/powershell/cygwin/msys/wsl choice once Windows is active; shows a disabled
 * single-option "POSIX (bash/zsh)" placeholder otherwise, since Linux and Mac
 * both quote identically and there is nothing to actually choose.
 */
export function ShellQuotingSelect({ value, onChange, title }: ShellQuotingSelectProps) {
  if (!isWindowsShell(value)) {
    return (
      <select
        disabled
        value="posix"
        title="This command quotes for POSIX (bash/zsh) — Linux and Mac quote identically, so there is nothing to choose here."
        className="h-8 cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500"
      >
        <option value="posix">POSIX (bash/zsh)</option>
      </select>
    );
  }
  return <PlatformSelect value={value} onChange={onChange} options={WINDOWS_SHELLS} title={title} />;
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
