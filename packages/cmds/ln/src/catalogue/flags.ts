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
import type { LnPlatform } from "../spec";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

export const FLAGS: readonly FlagDef[] = [
  // ── POSIX (ln) — windows-cygwin/windows-msys/windows-wsl run the exact
  // same real ln binary/flags as linux/mac, so they're listed alongside
  // them here. ──────────────────────────────────────────────────────────────
  {
    id: "symbolic",
    short: "-s",
    long: "--symbolic",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Create a symbolic link instead of a hard link.",
    detail: "Without this, ln creates a hard link — the default. A symlink can point across filesystems and to directories; a hard link cannot.",
    order: 10,
  },
  {
    id: "force",
    short: "-f",
    long: "--force",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    conflictsWith: ["interactive"],
    danger: "caution",
    summary: "Remove an existing destination file first.",
    detail: "Without this, ln refuses to overwrite an existing link_name.",
    order: 20,
  },
  {
    id: "interactive",
    short: "-i",
    long: "--interactive",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    conflictsWith: ["force"],
    summary: "Prompt before removing an existing destination.",
    detail: "The cautious counterpart to --force — asks first instead of removing silently.",
    order: 30,
  },
  {
    id: "verbose",
    short: "-v",
    long: "--verbose",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Print the name of each linked file.",
    detail: "Prints a message for every file linked, not just on failure.",
    order: 40,
  },
  {
    id: "relative",
    short: "-r",
    long: "--relative",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "With --symbolic, create the link using a relative path to the target.",
    detail: "Has no effect without --symbolic — a hard link has no path to be relative or absolute in the first place.",
    order: 50,
  },
  {
    id: "noTargetDirectory",
    short: "-T",
    long: "--no-target-directory",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Always treat link_name as a normal file, never as a directory to link into.",
    detail:
      "Without this, if link_name happens to already be an existing directory, ln silently links target inside it instead of failing or replacing it — this forces the literal interpretation.",
    order: 60,
  },

  // ── PowerShell (New-Item) ─────────────────────────────────────────────────
  {
    id: "forcePs",
    long: "-Force",
    group: "options",
    kind: "boolean",
    availableOn: ["windows-powershell"],
    danger: "caution",
    summary: "Overwrite an existing item at the link path.",
    detail: "Closest equivalent to --force. mklink (cmd.exe) has no equivalent at all — an existing link must be deleted manually first.",
    order: 10,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function isAvailableOn(flag: FlagDef, platform: LnPlatform): boolean {
  return isAvailableOnGeneric(flag, platform);
}

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
