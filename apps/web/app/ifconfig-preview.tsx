"use client";

import type { IfconfigPlatform, IfconfigSpec } from "@cmdgen/ifconfig";
import { buildArgv, lint, renderTokens } from "@cmdgen/ifconfig";
import { GeneratedCommandPanel } from "./generated-command-panel";

const CONTINUATION: Record<IfconfigPlatform, string> = {
  linux: " \\",
  mac: " \\",
  "windows-cmd": " ^",
  "windows-powershell": " `",
  "windows-cygwin": " \\",
  "windows-msys": " \\",
  "windows-wsl": " \\",
};

const isWindowsGroup = (platform: IfconfigPlatform) => platform !== "linux" && platform !== "mac";

/**
 * The Windows sub-choice as the user actually thinks about it. Unlike
 * `@cmdgen/mkdir`'s four genuinely-distinct Windows values, ifconfig's
 * windows-cmd and windows-powershell are indistinguishable (both invoke the
 * one real ipconfig.exe — see `render.ts`'s single `quoteForPlatform`
 * dispatch), so they collapse into one canonical picker entry,
 * `"windows-cmd"`, same value `IfconfigTargetSelector`'s Windows button
 * already defaults to. windows-cygwin/windows-msys/windows-wsl are each
 * their own entry since they invoke a genuinely different real binary
 * (`ifconfig`, POSIX flags) than the ipconfig pair.
 */
type WindowsDisplay = "windows-cmd" | "windows-cygwin" | "windows-msys" | "windows-wsl";

const windowsDisplayOf = (platform: IfconfigPlatform): WindowsDisplay =>
  platform === "windows-cygwin" || platform === "windows-msys" || platform === "windows-wsl"
    ? platform
    : "windows-cmd";

const WINDOWS_DISPLAY_LABEL: Record<WindowsDisplay, string> = {
  "windows-cmd": "ipconfig (Command Prompt / PowerShell)",
  "windows-cygwin": "Cygwin (real ifconfig)",
  "windows-msys": "MSYS2 / Git Bash (real ifconfig)",
  "windows-wsl": "WSL (real ifconfig)",
};

export interface IfconfigPreviewProps {
  spec: IfconfigSpec;
  onPlatformChange: (next: IfconfigPlatform) => void;
}

/**
 * ifconfig's data for the shared `GeneratedCommandPanel` template. Unlike
 * `@cmdgen/grep`'s or `@cmdgen/mkdir`'s preview, there's no always-visible
 * shell picker here — for the linux/mac/windows-cmd/windows-powershell
 * quartet this package started with, `ipconfig.exe` renders identically
 * from cmd.exe or PowerShell (same binary, same flags, same quoting needs),
 * so exposing a sub-choice there would just be confusing, and linux/mac
 * already have their own top-level buttons in `IfconfigTargetSelector`.
 *
 * windows-cygwin/windows-msys/windows-wsl break that "no visible effect"
 * premise — they invoke the real `ifconfig` with real POSIX flags, nothing
 * like ipconfig — so once the Windows button is active, a small sub-picker
 * appears to choose among the five Windows values. It stays hidden for
 * linux/mac, where there's still nothing to distinguish.
 */
export function IfconfigPreview({ spec, onPlatformChange }: IfconfigPreviewProps) {
  const argv = buildArgv(spec);

  return (
    <GeneratedCommandPanel
      continuation={CONTINUATION[spec.platform]}
      variants={[{ id: "normal", label: "Command", tokens: renderTokens(argv, spec.platform) }]}
      dialect={spec.platform}
      isDestructive={lint(spec).counts.destructive > 0}
      extraActions={
        isWindowsGroup(spec.platform) ? (
          <select
            value={windowsDisplayOf(spec.platform)}
            onChange={(e) => onPlatformChange(e.target.value as WindowsDisplay)}
            title="Which Windows environment will run this command — controls the binary, flags, and quoting."
            className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
          >
            {(Object.keys(WINDOWS_DISPLAY_LABEL) as WindowsDisplay[]).map((value) => (
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
