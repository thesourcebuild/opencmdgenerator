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
    id: "human",
    short: "-h",
    long: "--human",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["mega", "giga"],
    summary: "Print sizes in a human-readable form (auto-picking B, K, M, G, T).",
    detail: "Mutually exclusive with -m and -g — pick one unit convention, not several.",
    order: 10,
  },
  {
    id: "mega",
    short: "-m",
    long: "--mebi",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["human", "giga"],
    summary: "Show all sizes in mebibytes.",
    detail: "Mutually exclusive with -h and -g — pick one unit convention, not several.",
    order: 20,
  },
  {
    id: "giga",
    short: "-g",
    long: "--gibi",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["human", "mega"],
    summary: "Show all sizes in gibibytes.",
    detail: "Mutually exclusive with -h and -m — pick one unit convention, not several.",
    order: 30,
  },
  {
    id: "seconds",
    short: "-s",
    long: "--seconds",
    group: "options",
    kind: "number",
    preferShort: true,
    arg: { placeholder: "5", separator: " ", min: 1 },
    summary: "Repeat the display every N seconds.",
    detail: "Continues printing a fresh report every N seconds until interrupted, instead of printing once and exiting.",
    order: 40,
  },
  {
    id: "total",
    short: "-t",
    long: "--total",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Add a line with the column totals.",
    detail: "Sums memory and swap across every row already shown.",
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
