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
import type { CalPlatform } from "../spec";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

export const FLAGS: readonly FlagDef[] = [
  {
    id: "oneMonth",
    short: "-1",
    long: "-1",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show only one month (the default).",
    detail: "Explicitly forces single-month display; rarely needed since it's already the default.",
    order: 10,
  },
  {
    id: "threeMonths",
    short: "-3",
    long: "-3",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["wholeYear"],
    summary: "Show the previous, current, and next month side by side.",
    detail: "Mutually exclusive with -y — pick one display span.",
    order: 20,
  },
  {
    id: "wholeYear",
    short: "-y",
    long: "-y",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["threeMonths"],
    summary: "Show a calendar for the entire current year.",
    detail: "Mutually exclusive with -3.",
    order: 30,
  },
  {
    id: "mondayFirst",
    short: "-m",
    long: "-m",
    group: "options",
    kind: "boolean",
    preferShort: true,
    // Linux (util-linux) only: macOS's BSD `cal` also has a `-m`, but it
    // takes a required month argument — a completely different flag wearing
    // the same letter, not modeled here since the bare month/year fields
    // above already cover that case. Offering this boolean on macOS would
    // render a `cal -m` that fails with "option requires an argument -- 'm'".
    availableOn: ["linux"],
    summary: "Display Monday as the first day of the week.",
    detail: "Without this, most locales default to Sunday as the first column. Linux only — macOS's cal has no equivalent single boolean flag for this.",
    order: 40,
  },
  {
    id: "julian",
    short: "-j",
    long: "-j",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Display day-of-year (Julian) day numbers instead of day-of-month.",
    detail: "Shows each day as a number from 1-365/366 instead of 1-31.",
    order: 50,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function isAvailableOn(flag: FlagDef, platform: CalPlatform): boolean {
  return isAvailableOnGeneric(flag, platform);
}

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
