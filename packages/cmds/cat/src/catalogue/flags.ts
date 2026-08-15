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
import type { CatPlatform } from "../spec";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

export const FLAGS: readonly FlagDef[] = [
  // ── POSIX (cat) — cmd.exe's `type` has no flags at all. ──────────────────
  {
    id: "showAll",
    short: "-A",
    long: "--show-all",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    implies: ["showNonprinting", "showEnds", "showTabs"],
    summary: "Equivalent to -vET — show everything normally invisible.",
    detail: "The usual first thing to reach for when a file looks fine but behaves oddly — trailing whitespace, mixed line endings, or stray control characters.",
    order: 10,
  },
  {
    id: "numberAll",
    short: "-n",
    long: "--number",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    conflictsWith: ["numberNonblank"],
    summary: "Number every output line.",
    detail: "Numbers restart at 1 for each file when multiple files are given.",
    order: 20,
  },
  {
    id: "numberNonblank",
    short: "-b",
    long: "--number-nonblank",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    conflictsWith: ["numberAll"],
    summary: "Number only non-blank output lines.",
    detail: "Overrides -n if both are given — blank lines are skipped entirely rather than numbered.",
    order: 30,
  },
  {
    id: "squeezeBlank",
    short: "-s",
    long: "--squeeze-blank",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Collapse runs of multiple blank lines into one.",
    detail: "Three or more consecutive blank lines print as just one.",
    order: 40,
  },
  {
    id: "showEnds",
    short: "-E",
    long: "--show-ends",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Print $ at the end of each line.",
    detail: "Makes trailing whitespace and mixed line endings (CRLF vs LF) visible.",
    order: 50,
  },
  {
    id: "showTabs",
    short: "-T",
    long: "--show-tabs",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Print TAB characters as ^I.",
    detail: "Makes it obvious when whitespace is tabs rather than spaces.",
    order: 60,
  },
  {
    id: "showNonprinting",
    short: "-v",
    long: "--show-nonprinting",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Show non-printing characters using ^ and M- notation.",
    detail: "TAB and the end-of-line character are exempt — use -T and -E to reveal those too.",
    order: 70,
  },

  // ── PowerShell (Get-Content) ─────────────────────────────────────────────
  {
    id: "rawPs",
    long: "-Raw",
    group: "options",
    kind: "boolean",
    availableOn: ["windows-powershell"],
    summary: "Read the whole file as one string, instead of an array of lines.",
    detail: "Without this, Get-Content returns each line as a separate array element — usually invisible when just displaying the file, but it matters once the output is piped further.",
    order: 10,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function isAvailableOn(flag: FlagDef, platform: CatPlatform): boolean {
  return isAvailableOnGeneric(flag, platform);
}

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
