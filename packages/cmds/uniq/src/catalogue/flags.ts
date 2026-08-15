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
  {
    id: "count",
    short: "-c",
    long: "--count",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Prefix each output line with the number of times it occurred.",
    detail: "Counts consecutive occurrences only — same adjacency caveat as the rest of uniq.",
    order: 10,
  },
  {
    id: "repeated",
    short: "-d",
    long: "--repeated",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["unique"],
    summary: "Print only lines that were repeated (appeared more than once in a row).",
    detail: "Each duplicated group is printed once — the opposite selection of -u.",
    order: 20,
  },
  {
    id: "unique",
    short: "-u",
    long: "--unique",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["repeated"],
    summary: "Print only lines that were NOT repeated (appeared exactly once in a row).",
    detail: "The opposite selection of -d.",
    order: 30,
  },
  {
    id: "ignoreCase",
    short: "-i",
    long: "--ignore-case",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Fold case when comparing adjacent lines.",
    detail: "\"apple\" and \"Apple\" are treated as the same line.",
    order: 40,
  },
  {
    id: "skipFields",
    short: "-f",
    long: "-f",
    group: "options",
    kind: "number",
    // `long` set to the short spelling itself — same trick as @cmdgen/cut's -f.
    arg: { placeholder: "1", separator: " " },
    summary: "Ignore this many leading fields when comparing lines.",
    detail: "Fields are separated by whitespace, same as the shell's own default word-splitting.",
    order: 50,
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
