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
  // ── POSIX (diff) ──────────────────────────────────────────────────────────
  {
    id: "unified",
    short: "-u",
    long: "--unified",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    conflictsWith: ["context"],
    summary: "Output in unified format — the shape used for patches.",
    detail: "Shows a few lines of context around each change with a single +/- marker per line, the format git diff and patch both use.",
    order: 10,
  },
  {
    id: "context",
    short: "-c",
    long: "--context",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    conflictsWith: ["unified"],
    summary: "Output in context format.",
    detail: "Older and more verbose than unified format — shows a few lines before and after each change, with a distinct header per hunk.",
    order: 20,
  },
  {
    id: "brief",
    short: "-q",
    long: "--brief",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "Report only whether the files differ, not the actual differences.",
    detail: "Prints one of two things: nothing (identical) or \"Files X and Y differ\".",
    order: 30,
  },
  {
    id: "recursive",
    short: "-r",
    long: "--recursive",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "When comparing directories, recurse into subdirectories.",
    detail: "Without this, diff refuses to compare two directories at all.",
    order: 40,
  },
  {
    id: "ignoreCase",
    short: "-i",
    long: "--ignore-case",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "Ignore case differences.",
    detail: "\"Hello\" and \"hello\" compare as identical.",
    order: 50,
  },
  {
    id: "ignoreAllSpace",
    short: "-w",
    long: "--ignore-all-space",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "Ignore all whitespace when comparing lines.",
    detail: "The strongest whitespace-ignoring option — even a line with no whitespace at all compares equal to one with plenty, as long as the non-whitespace content matches.",
    order: 60,
  },
  {
    id: "ignoreSpaceChange",
    short: "-b",
    long: "--ignore-space-change",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "Ignore changes in the amount of whitespace, but not whitespace itself.",
    detail: "Weaker than --ignore-all-space — a line with no whitespace still differs from one with some.",
    order: 70,
  },
  {
    id: "ignoreBlankLines",
    short: "-B",
    long: "--ignore-blank-lines",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "Ignore changes that only insert or delete blank lines.",
    detail: "A change that only adds or removes empty lines doesn't show up in the diff at all.",
    order: 80,
  },
  {
    id: "newFile",
    short: "-N",
    long: "--new-file",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "Treat a missing file as an empty one, instead of erroring.",
    detail: "Useful when comparing directory trees where a file exists on only one side.",
    order: 90,
  },

  // ── cmd.exe (fc) ──────────────────────────────────────────────────────────
  {
    id: "caseInsensitiveCmd",
    long: "/C",
    group: "options",
    kind: "boolean",
    availableOn: ["cmd"],
    summary: "Ignore case differences.",
    detail: "\"Hello\" and \"hello\" compare as identical.",
    order: 10,
  },
  {
    id: "lineNumbersCmd",
    long: "/N",
    group: "options",
    kind: "boolean",
    availableOn: ["cmd"],
    summary: "Show line numbers for each difference.",
    detail: "Each differing line is prefixed with its position in the file.",
    order: 20,
  },
  {
    id: "abbreviatedCmd",
    long: "/A",
    group: "options",
    kind: "boolean",
    availableOn: ["cmd"],
    summary: "Abbreviate the output — show only the first and last line of each differing block.",
    detail: "Useful for a quick overview of large files without every changed line scrolling by.",
    order: 30,
  },
  {
    id: "binaryCmd",
    long: "/B",
    group: "options",
    kind: "boolean",
    availableOn: ["cmd"],
    danger: "caution",
    summary: "Compare byte-for-byte in binary mode, not line-by-line text mode.",
    detail: "The closest Windows equivalent to what @cmdgen/cmp does — no line-oriented options apply once this is on.",
    order: 40,
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
