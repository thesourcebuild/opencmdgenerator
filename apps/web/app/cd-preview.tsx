"use client";

import type { CdPlatform, CdSpec } from "@cmdgen/cd";
import { buildArgv, lint, renderTokens } from "@cmdgen/cd";
import { GeneratedCommandPanel } from "./generated-command-panel";
import { isWindows } from "./cd-target-selector";

/** cmd.exe's line continuation is `^`; PowerShell's is `` ` ``; every other dialect here is real bash, so `\`. */
const CONTINUATION: Record<CdPlatform, string> = {
  linux: " \\",
  mac: " \\",
  "windows-cmd": " ^",
  "windows-powershell": " `",
  "windows-cygwin": " \\",
  "windows-msys": " \\",
  "windows-wsl": " \\",
};

/** Only the Windows sub-choices — "posix" is picked via the Linux/Mac buttons in `CdTargetSelector`, not here. */
type WindowsShell = "windows-cmd" | "windows-powershell" | "windows-cygwin" | "windows-msys" | "windows-wsl";

const WINDOWS_DISPLAY_LABEL: Record<WindowsShell, string> = {
  "windows-cmd": "Command Prompt",
  "windows-powershell": "PowerShell",
  "windows-cygwin": "Cygwin",
  "windows-msys": "MSYS2 / Git Bash",
  "windows-wsl": "WSL",
};

export interface CdPreviewProps {
  spec: CdSpec;
  onPlatformChange: (next: CdPlatform) => void;
}

/**
 * cd's data for the shared `GeneratedCommandPanel` template — one-line,
 * multi-line and copy all come from the template itself. Only one ARGV
 * variant (no dry-run equivalent for cd). The shell sub-picker only appears
 * once "Windows" is the active target platform — Linux/Mac have nothing to
 * choose, so it stays hidden there rather than exposing a meaningless POSIX
 * option.
 */
export function CdPreview({ spec, onPlatformChange }: CdPreviewProps) {
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
            title="Which Windows environment will run this command — controls flags and quoting."
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
