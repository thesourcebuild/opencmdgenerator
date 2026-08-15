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
  // ── POSIX (sort) ──────────────────────────────────────────────────────────
  {
    id: "numeric",
    short: "-n",
    long: "--numeric-sort",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    conflictsWith: ["randomSort"],
    summary: "Sort by numeric value instead of lexically.",
    detail: "Without this, \"10\" sorts before \"9\" — plain string comparison, not numeric.",
    order: 10,
  },
  {
    id: "humanNumeric",
    short: "-h",
    long: "--human-numeric-sort",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    conflictsWith: ["randomSort"],
    summary: "Sort by numeric value, understanding suffixes like K, M, G.",
    detail: "The right choice for sorting du -h or ls -lh output by size.",
    order: 20,
  },
  {
    id: "reverse",
    short: "-r",
    long: "--reverse",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "Reverse the sort order.",
    detail: "Z-to-A instead of A-to-Z, or largest-to-smallest with -n.",
    order: 30,
  },
  {
    id: "unique",
    short: "-u",
    long: "--unique",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "Output only the first of each set of equal lines.",
    detail: "Deduplicates the output — only works correctly because the input is sorted first.",
    order: 40,
  },
  {
    id: "ignoreCase",
    short: "-f",
    long: "--ignore-case",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "Fold lowercase into uppercase before comparing.",
    detail: "\"apple\" and \"Apple\" sort as equivalent instead of \"Apple\" sorting before \"apple\".",
    order: 50,
  },
  {
    id: "ignoreLeadingBlanks",
    short: "-b",
    long: "--ignore-leading-blanks",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "Ignore leading whitespace when comparing lines.",
    detail: "A line indented with spaces sorts the same as the same line without the indentation.",
    order: 60,
  },
  {
    id: "randomSort",
    short: "-R",
    long: "--random-sort",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    conflictsWith: ["numeric", "humanNumeric"],
    summary: "Shuffle the lines into random order instead of sorting them.",
    detail: "Overrides any actual ordering — combining with a sort-key flag doesn't make sense.",
    order: 70,
  },
  {
    id: "check",
    short: "-c",
    long: "--check",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "Check whether the input is already sorted, instead of sorting it.",
    detail: "Prints nothing and exits 0 if already sorted, or reports the first out-of-order line and exits non-zero.",
    order: 80,
  },
  {
    id: "fieldSeparator",
    short: "-t",
    long: "-t",
    group: "options",
    kind: "text",
    availableOn: ["posix"],
    arg: { placeholder: ",", separator: " " },
    summary: "Use this character to separate fields instead of whitespace.",
    detail: "Matters together with -k (sort by a specific field), not modeled here — this catalogue always sorts whole lines.",
    order: 90,
  },

  // ── cmd.exe (sort) — /+n (start column) is intentionally not modeled: its
  // syntax attaches the number directly with no separator at all ("/+2"),
  // a shape the flag renderer has no way to produce (only "=" or " "
  // between a flag and its value), the same class of gap as ssh's -l or
  // ln's -t. ────────────────────────────────────────────────────────────────
  {
    id: "reverseCmd",
    long: "/R",
    group: "options",
    kind: "boolean",
    availableOn: ["cmd"],
    summary: "Reverse the sort order.",
    detail: "Z-to-A instead of A-to-Z.",
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
