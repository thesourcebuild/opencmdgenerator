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
    id: "serviceVersion",
    short: "-sV",
    long: "-sV",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Probe service versions",
    detail: "Probe service versions",
    order: 10,
  },
  {
    id: "osDetect",
    short: "-O",
    long: "-O",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Enable OS detection",
    detail: "Enable OS detection",
    order: 20,
  },
  {
    id: "ports",
    short: "-p",
    long: "-p",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Scan selected ports",
    detail: "Scan selected ports",
    order: 30,
    arg: {
      placeholder: "22,80,443",
      separator: " ",
    },
  },
  {
    id: "noPing",
    short: "-Pn",
    long: "-Pn",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Treat hosts as online",
    detail: "Treat hosts as online",
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
