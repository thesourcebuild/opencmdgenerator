"use client";

import type { ScpSpec } from "@cmdgen/scp";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/scp";
import { GeneratedCommandPanel } from "./generated-command-panel";
import { isWindows, scpPlatformOf, type ScpPlatform, type ScpWindowsPlatform } from "./scp-target-selector";

const WINDOWS_DISPLAY_LABEL: Record<ScpWindowsPlatform, string> = {
  "windows-cmd": "Command Prompt",
  "windows-powershell": "PowerShell",
  "windows-cygwin": "Cygwin (cwRsync)",
  "windows-msys": "MSYS2 / Git Bash",
  "windows-wsl": "WSL",
};

export interface ScpPreviewProps {
  spec: ScpSpec;
  onPlatformChange: (next: ScpPlatform) => void;
}

/** scp's data for the shared `GeneratedCommandPanel` template. The Windows sub-picker (which build + which shell) only appears once "Windows" is the active target platform — see `ScpTargetSelector`. */
export function ScpPreview({ spec, onPlatformChange }: ScpPreviewProps) {
  const argv = buildArgv(spec);
  const platform = scpPlatformOf(spec.shell, spec.pathFlavor);

  return (
    <GeneratedCommandPanel
      description=""
      continuation={continuationFor(spec.shell)}
      variants={[{ id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) }]}
      dialect={spec.shell}
      isDestructive={lint(spec).counts.destructive > 0}
      extraActions={
        isWindows(platform) ? (
          <select
            value={platform}
            onChange={(e) => onPlatformChange(e.target.value as ScpWindowsPlatform)}
            title="Which Windows environment will run this command — controls the scp build, quoting, and path spelling."
            className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
          >
            {(Object.keys(WINDOWS_DISPLAY_LABEL) as ScpWindowsPlatform[]).map((value) => (
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
