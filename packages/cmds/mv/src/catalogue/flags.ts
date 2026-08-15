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
import type { MvPlatform } from "../spec";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

export const FLAGS: readonly FlagDef[] = [
  // ── POSIX (mv) ────────────────────────────────────────────────────────────
  {
    id: "force",
    short: "-f",
    long: "--force",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    conflictsWith: ["interactive", "noClobber"],
    danger: "caution",
    summary: "Do not prompt before overwriting.",
    detail: "Without this, mv still overwrites silently in non-interactive scripts — this only matters combined with -i.",
    order: 10,
  },
  {
    id: "interactive",
    short: "-i",
    long: "--interactive",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    conflictsWith: ["force", "noClobber"],
    summary: "Prompt before overwriting an existing destination.",
    detail: "Asks for confirmation before any move that would overwrite something.",
    order: 20,
  },
  {
    id: "noClobber",
    short: "-n",
    long: "--no-clobber",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    conflictsWith: ["force", "interactive"],
    summary: "Never overwrite an existing destination.",
    detail: "Silently skips a move that would overwrite something, instead of prompting or forcing it through.",
    order: 30,
  },
  {
    id: "update",
    short: "-u",
    long: "--update",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Move only when the source is newer than an existing destination, or the destination is missing.",
    detail: "Skips moving a source that's older than what's already at the destination.",
    order: 40,
  },
  {
    id: "backup",
    short: "-b",
    long: "--backup",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Back up each existing destination file before overwriting it.",
    detail: "Renames the existing destination with a trailing ~ before the move proceeds.",
    order: 50,
  },
  {
    id: "stripTrailingSlashes",
    long: "--strip-trailing-slashes",
    group: "options",
    kind: "boolean",
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Remove any trailing slashes from each source argument first.",
    detail: "Mainly matters for a source that's a symlink to a directory — a trailing slash would make mv operate on what it points to instead of the link itself.",
    order: 60,
  },
  {
    id: "verbose",
    short: "-v",
    long: "--verbose",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Explain what is being done.",
    detail: "Prints a line for every source moved.",
    order: 70,
  },

  // ── cmd.exe (move) ────────────────────────────────────────────────────────
  {
    id: "noPromptCmd",
    long: "/Y",
    group: "options",
    kind: "boolean",
    availableOn: ["windows-cmd"],
    danger: "caution",
    summary: "Suppress the overwrite confirmation prompt.",
    detail: "Closest equivalent to --force. Without it, move.exe asks before overwriting an existing file.",
    order: 10,
  },

  // ── PowerShell (Move-Item) ────────────────────────────────────────────────
  {
    id: "forcePs",
    long: "-Force",
    group: "options",
    kind: "boolean",
    availableOn: ["windows-powershell"],
    danger: "caution",
    summary: "Move even if the destination is hidden, read-only, or already exists.",
    detail: "Without this, Move-Item refuses to overwrite an existing item at the destination.",
    order: 10,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function isAvailableOn(flag: FlagDef, platform: MvPlatform): boolean {
  return isAvailableOnGeneric(flag, platform);
}

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
