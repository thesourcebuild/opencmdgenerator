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
    id: "process",
    short: "-p",
    long: "-p",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Filter by PID",
    detail: "Filter by PID",
    order: 10,
    arg: {
      placeholder: "1234",
      separator: " ",
    },
  },
  {
    id: "user",
    short: "-u",
    long: "-u",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Filter by user",
    detail: "Filter by user",
    order: 20,
    arg: {
      placeholder: "www-data",
      separator: " ",
    },
  },
  {
    id: "network",
    short: "-i",
    long: "-i",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Filter network files",
    detail: "Filter network files",
    order: 30,
    arg: {
      placeholder: ":80",
      separator: " ",
    },
  },
  {
    id: "noNames",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Do not resolve network names",
    detail: "Do not resolve network names",
    order: 40,
  },
  {
    id: "noPorts",
    short: "-P",
    long: "-P",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Do not resolve port names",
    detail: "Do not resolve port names",
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
