"use client";

import type { TraceroutePlatform, TracerouteSpec } from "@cmdgen/traceroute";
import { buildArgv, lint, renderTokens } from "@cmdgen/traceroute";
import { GeneratedCommandPanel } from "./generated-command-panel";
import { isWindows } from "./traceroute-target-selector";

const CONTINUATION: Record<TraceroutePlatform, string> = {
  linux: " \\",
  mac: " \\",
  "windows-cmd": " ^",
  "windows-powershell": " `",
  "windows-cygwin": " \\",
  "windows-msys": " \\",
  "windows-wsl": " \\",
};

type WindowsShell = "windows-cmd" | "windows-powershell" | "windows-cygwin" | "windows-msys" | "windows-wsl";

const WINDOWS_DISPLAY_LABEL: Record<WindowsShell, string> = {
  "windows-cmd": "Command Prompt",
  "windows-powershell": "PowerShell",
  "windows-cygwin": "Cygwin",
  "windows-msys": "MSYS2 / Git Bash",
  "windows-wsl": "WSL",
};

/**
 * Unlike `@cmdgen/grep`'s preview, there is no cmd.exe/PowerShell picker
 * exposed while windows-cmd/windows-powershell are the only two Windows
 * choices in play: tracert.exe is a single real .exe that behaves
 * identically from either shell, so there'd be no genuine choice to expose.
 * That stopped being true once windows-cygwin/windows-msys/windows-wsl joined
 * the Windows sub-choices — they invoke a different binary (real `traceroute`,
 * not `tracert`) with different flag letters, so we DO need a way to pick
 * among all 5 once "Windows" is the active top-level button. This mirrors
 * `@cmdgen/mkdir`'s/`@cmdgen/clear`'s `DisplayShell`/`DISPLAY_LABEL` shell
 * picker shape, except it's only shown for Windows platforms — Linux/Mac
 * have no sub-choice to expose, so the picker would be meaningless there.
 */
export interface TraceroutePreviewProps {
  spec: TracerouteSpec;
  onPlatformChange: (next: TraceroutePlatform) => void;
}

export function TraceroutePreview({ spec, onPlatformChange }: TraceroutePreviewProps) {
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
            onChange={(e) => onPlatformChange(e.target.value as TraceroutePlatform)}
            title="Which Windows environment will run this command — controls the binary, flags, and quoting."
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
