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
import type { CpPlatform } from "../spec";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

export const FLAGS: readonly FlagDef[] = [
  // ── POSIX (cp) ────────────────────────────────────────────────────────────
  {
    id: "recursive",
    short: "-r",
    long: "--recursive",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Copy directories recursively.",
    detail: "Without this, cp refuses to copy a directory at all.",
    order: 10,
  },
  {
    id: "archive",
    short: "-a",
    long: "--archive",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    implies: ["recursive", "preserve"],
    summary: "Same as -dR --preserve=all — a full, faithful copy.",
    detail: "The usual choice for backing up or cloning a directory tree exactly, permissions and timestamps included.",
    order: 20,
  },
  {
    id: "force",
    short: "-f",
    long: "--force",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    danger: "caution",
    summary: "If an existing destination can't be opened for writing, remove it and try again.",
    detail: "Ignored when combined with --no-clobber.",
    order: 30,
  },
  {
    id: "interactive",
    short: "-i",
    long: "--interactive",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    conflictsWith: ["noClobber"],
    summary: "Prompt before overwriting an existing destination.",
    detail: "Asks for confirmation before any copy that would overwrite something.",
    order: 40,
  },
  {
    id: "noClobber",
    short: "-n",
    long: "--no-clobber",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    conflictsWith: ["interactive"],
    summary: "Never overwrite an existing destination.",
    detail: "Silently skips a copy that would overwrite something, instead of prompting or forcing it through.",
    order: 50,
  },
  {
    id: "link",
    short: "-l",
    long: "--link",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    conflictsWith: ["symbolicLink"],
    summary: "Hard link files instead of copying them.",
    detail: "The destination becomes another name for the same file data — no separate copy is made.",
    order: 60,
  },
  {
    id: "symbolicLink",
    short: "-s",
    long: "--symbolic-link",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    conflictsWith: ["link"],
    summary: "Make symbolic links instead of copying.",
    detail: "Creates a link pointing back to each source instead of a real copy — the same operation ln -s does.",
    order: 70,
  },
  {
    id: "preserve",
    short: "-p",
    long: "--preserve",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Preserve mode, ownership, and timestamps.",
    detail: "Without this, the copy gets fresh timestamps and inherits ownership/permissions from the current user's umask instead of the source's.",
    order: 80,
  },
  {
    id: "update",
    short: "-u",
    long: "--update",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Copy only when the source is newer than an existing destination, or the destination is missing.",
    detail: "Skips copying a source that's older than what's already at the destination.",
    order: 90,
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
    detail: "Prints a line for every source copied.",
    order: 100,
  },

  // ── cmd.exe (copy) — note: no recursive-directory-copy flag exists at all;
  // xcopy/robocopy are separate binaries this app does not model here. ──────
  {
    id: "noPromptCmd",
    long: "/Y",
    group: "options",
    kind: "boolean",
    availableOn: ["windows-cmd"],
    danger: "caution",
    summary: "Suppress the overwrite confirmation prompt.",
    detail: "Without it, copy asks before overwriting an existing file.",
    order: 10,
  },

  // ── PowerShell (Copy-Item) ────────────────────────────────────────────────
  {
    id: "recursivePs",
    long: "-Recurse",
    group: "options",
    kind: "boolean",
    availableOn: ["windows-powershell"],
    summary: "Copy directories recursively.",
    detail: "The one Windows platform where cp's -r has a real, working equivalent — cmd.exe's copy can't do this at all.",
    order: 10,
  },
  {
    id: "forcePs",
    long: "-Force",
    group: "options",
    kind: "boolean",
    availableOn: ["windows-powershell"],
    danger: "caution",
    summary: "Copy even if the destination is hidden, read-only, or already exists.",
    detail: "Without this, Copy-Item refuses to overwrite an existing item at the destination.",
    order: 20,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function isAvailableOn(flag: FlagDef, platform: CpPlatform): boolean {
  return isAvailableOnGeneric(flag, platform);
}

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
