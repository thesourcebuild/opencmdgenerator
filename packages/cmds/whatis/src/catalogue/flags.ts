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
  // ── options ───────────────────────────────────────────────────────────────
  {
    id: "regex",
    short: "-r",
    long: "-r",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["wildcard"],
    summary: "Interpret the search term as a regular expression.",
    detail: "Without this, whatis matches the name exactly (case-sensitively).",
    order: 10,
  },
  {
    id: "wildcard",
    short: "-w",
    long: "-w",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["regex"],
    summary: "Interpret the search term as a shell wildcard pattern.",
    detail: "Mutually exclusive with -r — pick one pattern style, not both.",
    order: 20,
  },
  {
    id: "caseInsensitive",
    short: "-i",
    long: "-i",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Ignore case when matching.",
    detail: "Applies whether matching exactly, as a wildcard, or as a regular expression.",
    order: 30,
  },
  {
    id: "long",
    short: "-l",
    long: "-l",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Do not trim the output to the terminal width.",
    detail: "Shows the full description line even if it would otherwise be truncated.",
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
