import {
  createFlagCatalogue,
  flagLabel as flagLabelGeneric,
  type DangerLevel,
  type FlagArgSpec,
  type FlagDef as FlagDefGeneric,
  type FlagEnumOption,
  type FlagKind,
} from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

export const FLAGS: readonly FlagDef[] = [
  // ── removal (POSIX) ──────────────────────────────────────────────────────
  {
    id: "recursive",
    short: "-r",
    long: "-r",
    group: "removal",
    kind: "boolean",
    preferShort: true,
    danger: "destructive",
    availableOn: ["posix"],
    summary: "Remove directories and their contents recursively.",
    detail: "Without this, rm refuses to remove a directory at all. With it, an entire tree disappears in one call.",
    order: 100,
  },
  {
    id: "force",
    short: "-f",
    long: "-f",
    group: "removal",
    kind: "boolean",
    preferShort: true,
    danger: "destructive",
    availableOn: ["posix"],
    summary: "Never prompt, ignore nonexistent files.",
    detail:
      "Suppresses every confirmation and every \"no such file\" error. Combined with -r, this is rm -rf — the single most-feared shell invocation for a reason.",
    order: 110,
  },
  {
    id: "interactive",
    long: "-i",
    group: "removal",
    kind: "enum",
    conflictsWith: ["force"],
    availableOn: ["posix"],
    options: [
      { value: "none", label: "Never (default)", renders: "" },
      { value: "once", label: "Once, if removing 3+ files or recursively (-I)", renders: "-I" },
      { value: "always", label: "Before every removal (-i)", renders: "-i" },
    ],
    summary: "Ask for confirmation before removing.",
    detail:
      "-I asks once before a large or recursive removal — usually enough friction to catch a mistake without prompting for every single file the way -i does.",
    order: 120,
  },
  {
    id: "removeEmptyDirs",
    short: "-d",
    long: "-d",
    group: "removal",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["recursive"],
    danger: "caution",
    availableOn: ["posix"],
    summary: "Remove empty directories too (without recursing).",
    detail: "Unlike -r, refuses if the directory has anything in it — a narrower, safer way to clean up empty dirs.",
    order: 130,
  },
  {
    id: "noPreserveRoot",
    long: "--no-preserve-root",
    group: "removal",
    kind: "boolean",
    danger: "destructive",
    availableOn: ["posix"],
    summary: "Allow recursive removal of / itself.",
    detail:
      "GNU rm refuses \"rm -rf /\" by default specifically to prevent this. Turning this off removes that one remaining safety net.",
    order: 140,
  },

  // ── removal (PowerShell / Remove-Item) ───────────────────────────────────
  {
    id: "recursePs",
    long: "-Recurse",
    group: "removal",
    kind: "boolean",
    danger: "destructive",
    availableOn: ["powershell"],
    summary: "Remove directories and their contents recursively.",
    detail: "Same idea as -r — Remove-Item refuses a non-empty directory without it.",
    order: 150,
  },
  {
    id: "forcePs",
    long: "-Force",
    group: "removal",
    kind: "boolean",
    danger: "destructive",
    availableOn: ["powershell"],
    summary: "Remove hidden/read-only items too, and suppress some prompts.",
    detail:
      "The closest equivalent to -f. Unlike POSIX rm's -f, it does not by itself suppress the -Confirm prompt below.",
    order: 160,
  },
  {
    id: "confirmPs",
    long: "-Confirm",
    group: "removal",
    kind: "boolean",
    availableOn: ["powershell"],
    summary: "Prompt for confirmation before every removal.",
    detail: "The closest equivalent to -i. There is no PowerShell equivalent to -I's \"ask once for 3+\" behavior.",
    order: 170,
  },
  {
    id: "whatIfPs",
    long: "-WhatIf",
    group: "removal",
    kind: "boolean",
    availableOn: ["powershell"],
    summary: "Preview what would be removed, without removing anything.",
    detail:
      "A real dry-run — something POSIX rm has no equivalent for at all. Worth turning on first for anything recursive or forced.",
    order: 180,
  },

  // ── output ────────────────────────────────────────────────────────────────
  {
    id: "verbose",
    short: "-v",
    long: "-v",
    group: "output",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "Print each file as it's removed.",
    detail: "The closest thing rm has to a preview — you at least see what happened, after it happened.",
    order: 200,
  },
  {
    id: "verbosePs",
    long: "-Verbose",
    group: "output",
    kind: "boolean",
    availableOn: ["powershell"],
    summary: "Print each item as it's removed.",
    detail: "Equivalent to -v — a PowerShell common parameter available on virtually every cmdlet.",
    order: 210,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
