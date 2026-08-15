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
import type { MkdirPlatform } from "../spec";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

export const FLAGS: readonly FlagDef[] = [
  // ── POSIX (mkdir) — cmd.exe's md always creates intermediate directories
  // and has no flags at all, so it gets no entries here. ────────────────────
  {
    id: "parents",
    short: "-p",
    long: "--parents",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Create intermediate directories as needed, and don't error if the target already exists.",
    detail: "Without this, mkdir fails if a parent directory is missing, or if the target already exists.",
    order: 10,
  },
  {
    id: "mode",
    short: "-m",
    long: "--mode",
    group: "options",
    kind: "text",
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    arg: { placeholder: "755", separator: " " },
    summary: "Set the permission mode of each created directory.",
    detail: "Octal (755) or symbolic (u=rwx,go=rx) — same syntax chmod accepts. Applied as each directory is created, not afterward.",
    order: 20,
  },
  {
    id: "verbose",
    short: "-v",
    long: "--verbose",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Print a message for each created directory.",
    detail: "Useful with --parents to see exactly which intermediate directories were created.",
    order: 30,
  },
  {
    id: "context",
    short: "-Z",
    long: "--context",
    group: "options",
    kind: "text",
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    arg: { placeholder: "unconfined_u:object_r:user_home_t:s0", separator: "=" },
    summary: "Set the SELinux security context of each created directory.",
    detail: "Only meaningful on SELinux-enabled systems. Rarely needed outside specific hardened deployments.",
    order: 40,
  },

  // ── PowerShell (New-Item -ItemType Directory) ────────────────────────────
  {
    id: "forcePs",
    long: "-Force",
    group: "options",
    kind: "boolean",
    availableOn: ["windows-powershell"],
    summary: "Don't error if the directory already exists.",
    detail: "Intermediate directories are already created automatically without this — closest equivalent to mkdir -p's \"don't error if it exists\" half, not its parent-creation half.",
    order: 10,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function isAvailableOn(flag: FlagDef, platform: MkdirPlatform): boolean {
  return isAvailableOnGeneric(flag, platform);
}

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
