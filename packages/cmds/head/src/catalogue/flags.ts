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
  // ── POSIX (head) ──────────────────────────────────────────────────────────
  {
    id: "linesCount",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "number",
    availableOn: ["posix"],
    conflictsWith: ["bytesCount"],
    arg: { placeholder: "10", separator: " " },
    summary: "Print the first N lines instead of the default 10.",
    detail: "A negative N prints all but the last N lines instead.",
    order: 10,
  },
  {
    id: "bytesCount",
    short: "-c",
    long: "-c",
    group: "options",
    kind: "number",
    availableOn: ["posix"],
    conflictsWith: ["linesCount"],
    arg: { placeholder: "512", separator: " " },
    summary: "Print the first N bytes instead of counting lines.",
    detail: "Ignores line boundaries entirely — output may end mid-line.",
    order: 20,
  },
  {
    id: "quiet",
    short: "-q",
    long: "--quiet",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    conflictsWith: ["verbose"],
    summary: "Never print a header naming each file.",
    detail: "Only matters with more than one file — head normally labels each section with ==> filename <==.",
    order: 30,
  },
  {
    id: "verbose",
    short: "-v",
    long: "--verbose",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    conflictsWith: ["quiet"],
    summary: "Always print a header naming each file, even for just one.",
    detail: "The opposite default from --quiet — useful in scripts that always want the ==> filename <== marker present.",
    order: 40,
  },

  // ── PowerShell (Get-Content) ─────────────────────────────────────────────
  {
    id: "totalCountPs",
    long: "-TotalCount",
    group: "options",
    kind: "number",
    availableOn: ["powershell"],
    arg: { placeholder: "10", separator: " " },
    summary: "Print the first N lines instead of the whole file.",
    detail: "Without this, Get-Content returns every line.",
    order: 10,
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
