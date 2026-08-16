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
    id: "user",
    short: "-u",
    long: "--user",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print effective user ID",
    detail: "Print effective user ID",
    order: 10,
  },
  {
    id: "group",
    short: "-g",
    long: "--group",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print effective group ID",
    detail: "Print effective group ID",
    order: 20,
  },
  {
    id: "groups",
    short: "-G",
    long: "--groups",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print all group IDs",
    detail: "Print all group IDs",
    order: 30,
  },
  {
    id: "name",
    short: "-n",
    long: "--name",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print names instead of numbers",
    detail: "Print names instead of numbers",
    order: 40,
  },
  {
    id: "real",
    short: "-r",
    long: "--real",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print real IDs",
    detail: "Print real IDs",
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
