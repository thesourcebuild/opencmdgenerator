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
    id: "silent",
    short: "-s",
    long: "--silent",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["verbose"],
    summary: "Print nothing — only the exit status says whether the files differ.",
    detail: "The usual choice inside a script, checking $? afterward rather than reading any output.",
    order: 10,
  },
  {
    id: "verbose",
    short: "-l",
    long: "--verbose",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["silent"],
    summary: "Print the byte number and differing byte values for every difference, not just the first.",
    detail: "Without this, cmp stops and reports only the first byte where the files differ.",
    order: 20,
  },
  {
    id: "printBytes",
    short: "-b",
    long: "--print-bytes",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print the differing bytes themselves alongside their values.",
    detail: "Only meaningful together with --verbose — each reported difference also shows the actual byte values, not just their offset.",
    order: 30,
  },
  {
    id: "ignoreInitial",
    short: "-i",
    long: "--ignore-initial",
    group: "options",
    kind: "number",
    arg: { placeholder: "512", separator: "=" },
    summary: "Skip this many bytes at the start of both files before comparing.",
    detail: "Useful when comparing files with a known-different header (e.g. a timestamp) but identical content after it.",
    order: 40,
  },
  {
    id: "bytesLimit",
    short: "-n",
    long: "--bytes",
    group: "options",
    kind: "number",
    arg: { placeholder: "1024", separator: "=" },
    summary: "Compare at most this many bytes.",
    detail: "Stops the comparison early even if both files continue beyond this length.",
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
