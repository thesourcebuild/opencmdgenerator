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
  // ── POSIX (tail) ──────────────────────────────────────────────────────────
  {
    id: "linesCount",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "number",
    availableOn: ["posix"],
    conflictsWith: ["bytesCount"],
    arg: { placeholder: "10", separator: " " },
    summary: "Print the last N lines instead of the default 10.",
    detail: "A leading + prints starting from line N instead of counting from the end.",
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
    summary: "Print the last N bytes instead of counting lines.",
    detail: "Ignores line boundaries entirely — output may start mid-line.",
    order: 20,
  },
  {
    id: "follow",
    short: "-f",
    long: "--follow",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "Keep the file open and print new lines as they're appended.",
    detail: "tail's most iconic use — watching a log file live. Ctrl-C stops it.",
    order: 30,
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
    detail: "Only matters with more than one file — tail normally labels each section with ==> filename <==.",
    order: 40,
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
    detail: "The opposite default from --quiet.",
    order: 50,
  },

  // ── PowerShell (Get-Content) ─────────────────────────────────────────────
  {
    id: "tailCountPs",
    long: "-Tail",
    group: "options",
    kind: "number",
    availableOn: ["powershell"],
    arg: { placeholder: "10", separator: " " },
    summary: "Print the last N lines instead of the whole file.",
    detail: "Without this, Get-Content returns every line.",
    order: 10,
  },
  {
    id: "waitPs",
    long: "-Wait",
    group: "options",
    kind: "boolean",
    availableOn: ["powershell"],
    summary: "Keep the file open and print new lines as they're appended.",
    detail: "The direct equivalent of tail -f.",
    order: 20,
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
