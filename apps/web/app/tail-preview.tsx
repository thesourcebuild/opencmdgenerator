"use client";

import type { TailPlatform, TailSpec } from "@cmdgen/tail";
import { buildArgv, lint, renderTokens } from "@cmdgen/tail";
import { GeneratedCommandPanel } from "./generated-command-panel";
import { isWindows } from "./tail-target-selector";

const CONTINUATION: Record<TailPlatform, string> = {
  linux: " \\",
  mac: " \\",
  "windows-powershell": " `",
  "windows-cygwin": " \\",
  "windows-msys": " \\",
  "windows-wsl": " \\",
};

/** Only the Windows sub-choices — "posix" is picked via the Linux/Mac buttons in `TailTargetSelector`, not here. */
type WindowsShell = "windows-powershell" | "windows-cygwin" | "windows-msys" | "windows-wsl";

const WINDOWS_DISPLAY_LABEL: Record<WindowsShell, string> = {
  "windows-powershell": "PowerShell",
  "windows-cygwin": "Cygwin",
  "windows-msys": "MSYS2 / Git Bash",
  "windows-wsl": "WSL",
};

export interface TailPreviewProps {
  spec: TailSpec;
  onPlatformChange: (next: TailPlatform) => void;
}

/** tail's data for the shared `GeneratedCommandPanel` template — same shape as `@cmdgen/ls`'s preview, including the always-visible shell picker. */
export function TailPreview({ spec, onPlatformChange }: TailPreviewProps) {
  const argv = buildArgv(spec);

  return (
    <GeneratedCommandPanel
      continuation={CONTINUATION[spec.platform]}
      variants={[{ id: "normal", label: "Command", tokens: renderTokens(argv, spec.platform) }]}
      dialect={spec.platform}
      isDestructive={lint(spec).counts.destructive > 0}
      extraActions={
        isWindows(spec.platform) ? (
          <select
            value={spec.platform}
            onChange={(e) => onPlatformChange(e.target.value as WindowsShell)}
            title="Which Windows shell will run this command — controls flags and quoting."
            className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
          >
            {(Object.keys(WINDOWS_DISPLAY_LABEL) as WindowsShell[]).map((value) => (
              <option key={value} value={value}>
                {WINDOWS_DISPLAY_LABEL[value]}
              </option>
            ))}
          </select>
        ) : (
          <select
            disabled
            value="posix"
            title="This command quotes for POSIX (bash/zsh) — Linux and Mac quote identically, so there is nothing to choose here."
            className="h-8 cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500"
          >
            <option value="posix">POSIX (bash/zsh)</option>
          </select>
        )
      }
    />
  );
}
