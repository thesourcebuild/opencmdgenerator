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
    id: "extended",
    short: "-e",
    long: "--extended",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print extended CPU table",
    detail: "Print extended CPU table",
    order: 10,
  },
  {
    id: "parse",
    short: "-p",
    long: "--parse",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print parseable output",
    detail: "Print parseable output",
    order: 20,
  },
  {
    id: "json",
    short: "-J",
    long: "--json",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Output JSON",
    detail: "Output JSON",
    order: 30,
  },
  {
    id: "hex",
    short: "-x",
    long: "--hex",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print masks in hexadecimal",
    detail: "Print masks in hexadecimal",
    order: 40,
  },
  {
    id: "online",
    short: "-b",
    long: "--online",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Limit to online CPUs",
    detail: "Limit to online CPUs",
    order: 50,
  },
  {
    id: "offline",
    short: "-c",
    long: "--offline",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Limit to offline CPUs",
    detail: "Limit to offline CPUs",
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
