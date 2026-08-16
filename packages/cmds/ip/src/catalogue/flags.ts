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
    id: "brief",
    short: "-br",
    long: "-brief",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print brief output",
    detail: "Print brief output",
    order: 10,
  },
  {
    id: "json",
    short: "-j",
    long: "--json",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Output JSON",
    detail: "Output JSON",
    order: 20,
  },
  {
    id: "details",
    short: "-d",
    long: "--details",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show more details",
    detail: "Show more details",
    order: 30,
  },
  {
    id: "stats",
    short: "-s",
    long: "--stats",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show statistics",
    detail: "Show statistics",
    order: 40,
  },
  {
    id: "color",
    short: "-c",
    long: "--color",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Use color output",
    detail: "Use color output",
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
