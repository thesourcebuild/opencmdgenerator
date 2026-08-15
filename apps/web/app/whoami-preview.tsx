"use client";

import type { WhoamiPlatform, WhoamiSpec } from "@cmdgen/whoami";
import { buildArgv, lint, renderTokens } from "@cmdgen/whoami";
import { GeneratedCommandPanel } from "./generated-command-panel";
import { isWindows } from "./whoami-target-selector";

const CONTINUATION: Record<WhoamiPlatform, string> = {
  posix: " \\",
  "windows-cmd": " ^",
  "windows-powershell": " `",
  "windows-cygwin": " \\",
  "windows-msys": " \\",
  "windows-wsl": " \\",
};

/** Only the Windows sub-choices — "posix" is picked via the POSIX/Windows buttons in `WhoamiTargetSelector`, not here. */
type WindowsShell = "windows-cmd" | "windows-powershell" | "windows-cygwin" | "windows-msys" | "windows-wsl";

const WINDOWS_DISPLAY_LABEL: Record<WindowsShell, string> = {
  "windows-cmd": "Command Prompt",
  "windows-powershell": "PowerShell",
  "windows-cygwin": "Cygwin",
  "windows-msys": "MSYS2 / Git Bash",
  "windows-wsl": "WSL",
};

export interface WhoamiPreviewProps {
  spec: WhoamiSpec;
  onPlatformChange: (next: WhoamiPlatform) => void;
}

/**
 * whoami's data for the shared `GeneratedCommandPanel` template. The shell
 * picker here always shows all 5 real options directly (no POSIX-folds-
 * linux-and-mac indirection needed, since the type itself is already just
 * these 6 values) — same flat, no-indirection shape as before, just with
 * `windows-cygwin`/`windows-msys`/`windows-wsl` added alongside the other two
 * Windows choices. They still render bare (no `/ALL`/`/GROUPS`/`/PRIV`), same
 * as `posix` — only the quoting/continuation dialect differs by choice here.
 */
export function WhoamiPreview({ spec, onPlatformChange }: WhoamiPreviewProps) {
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
            title="Which Windows environment will run this command — controls flags."
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
