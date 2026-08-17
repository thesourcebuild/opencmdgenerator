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
    id: "listen",
    short: "-l",
    long: "-l",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Listen for inbound connections",
    detail: "Listen for inbound connections",
    order: 10,
  },
  {
    id: "port",
    short: "-p",
    long: "-p",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Use a local port",
    detail: "Use a local port",
    order: 20,
    arg: {
      placeholder: "8080",
      separator: " ",
    },
  },
  {
    id: "zeroIo",
    short: "-z",
    long: "-z",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Scan without sending data",
    detail: "Scan without sending data",
    order: 30,
  },
  {
    id: "verbose",
    short: "-v",
    long: "-v",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Verbose output",
    detail: "Verbose output",
    order: 40,
  },
  {
    id: "udp",
    short: "-u",
    long: "-u",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Use UDP",
    detail: "Use UDP",
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
