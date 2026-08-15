import {
  createFlagCatalogue,
  flagLabel as flagLabelGeneric,
  isAvailableOn as isAvailableOnGeneric,
  type DangerLevel,
  type FlagArgSpec,
  type FlagDef as FlagDefGeneric,
  type FlagEnumOption,
  type FlagKind,
} from "@cmdgen/engine";
import type { FlagGroup } from "./groups";
import type { EchoPlatform } from "../spec";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

export const FLAGS: readonly FlagDef[] = [
  // ── POSIX (echo) — cmd.exe's echo has no flags at all. Cygwin, MSYS2 and
  // WSL run the exact same real bash builtin echo as linux/mac, so these two
  // flags are available there too. ─────────────────────────────────────────
  {
    id: "noNewline",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Don't print the trailing newline.",
    detail: "Useful when the next thing printed should continue on the same line, e.g. a progress indicator.",
    order: 10,
  },
  {
    id: "escapeMode",
    long: "-e/-E",
    group: "options",
    kind: "enum",
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    options: [
      { value: "none", label: "Default (shell-dependent)", renders: "" },
      { value: "interpret", label: "Interpret backslash escapes (-e)", renders: "-e" },
      { value: "disable", label: "Disable backslash escapes (-E)", renders: "-E" },
    ],
    summary: "Whether \\n, \\t and similar sequences in the text are interpreted or printed literally.",
    detail:
      "Bash's builtin echo does not interpret them by default, but this varies by shell and by /bin/sh's own echo — -e/-E make the choice explicit rather than relying on the ambient default.",
    order: 20,
  },

  // ── PowerShell (Write-Output / Write-Host) ───────────────────────────────
  {
    id: "noNewlinePs",
    long: "-NoNewline",
    group: "options",
    kind: "boolean",
    availableOn: ["windows-powershell"],
    summary: "Don't print the trailing newline.",
    detail: "Write-Output has no such option at all — asking for this switches the generated command to Write-Host instead, the only PowerShell cmdlet that supports it.",
    order: 10,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function isAvailableOn(flag: FlagDef, platform: EchoPlatform): boolean {
  return isAvailableOnGeneric(flag, platform);
}

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
