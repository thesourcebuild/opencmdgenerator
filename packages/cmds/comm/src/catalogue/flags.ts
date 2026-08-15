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
    id: "suppressCol1",
    short: "-1",
    long: "-1",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Suppress column 1 — lines found only in FILE1.",
    detail: "Combine with -3 to see only lines unique to FILE2.",
    order: 10,
  },
  {
    id: "suppressCol2",
    short: "-2",
    long: "-2",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Suppress column 2 — lines found only in FILE2.",
    detail: "Combine with -3 to see only lines unique to FILE1.",
    order: 20,
  },
  {
    id: "suppressCol3",
    short: "-3",
    long: "-3",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Suppress column 3 — lines found in both files.",
    detail: "Combine with -1 or -2 to see only what's unique to one file, with none of the shared lines.",
    order: 30,
  },
  {
    id: "ignoreCase",
    short: "-i",
    long: "--ignore-case",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Compare case-insensitively.",
    detail: "\"Hello\" and \"hello\" compare as the same line.",
    order: 40,
  },
  {
    id: "checkOrder",
    long: "--check-order",
    group: "options",
    kind: "boolean",
    conflictsWith: ["noCheckOrder"],
    summary: "Force a warning if either input isn't in sorted order.",
    detail: "Normally only enabled automatically when all three columns would otherwise print — comm needs sorted input to produce meaningful output at all.",
    order: 50,
  },
  {
    id: "noCheckOrder",
    long: "--nocheck-order",
    group: "options",
    kind: "boolean",
    conflictsWith: ["checkOrder"],
    summary: "Never warn about unsorted input.",
    detail: "Suppresses the warning even when comm would otherwise print one automatically.",
    order: 60,
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
