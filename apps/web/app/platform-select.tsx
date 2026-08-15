"use client";

import type { ShellDialect } from "@cmdgen/engine";

const PLATFORM_LABEL: Record<ShellDialect, string> = {
  posix: "POSIX (bash/zsh)",
  cmd: "Command Prompt",
  powershell: "PowerShell",
  cygwin: "Cygwin",
  msys: "MSYS2 / Git Bash",
  wsl: "WSL",
};

export interface PlatformSelectProps<T extends string> {
  value: T;
  onChange: (next: T) => void;
  /**
   * Which of the 2 or 3 real `ShellDialect` values this particular command
   * actually supports — e.g. ls/rm/kill never offer "cmd" (no cmd.exe
   * equivalent binary exists), while ssh/scp/tar/rsync offer all three (they
   * are plain argv .exe files that run unchanged from any shell).
   */
  options: readonly T[];
  title?: string;
}

/** The shell-picker dropdown shared by every command whose platform axis is (a subset of) `ShellDialect` — which options to show is the caller's own claim, not assumed here. */
export function PlatformSelect<T extends string>({ value, onChange, options, title }: PlatformSelectProps<T>) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      title={title ?? "Which shell will run this command — controls available flags and quoting."}
      className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
    >
      {options.map((p) => (
        <option key={p} value={p}>
          {PLATFORM_LABEL[p as ShellDialect] ?? p}
        </option>
      ))}
    </select>
  );
}
