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
    id: "report",
    short: "-r",
    long: "--report",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Report mode",
    detail: "Report mode",
    order: 10,
  },
  {
    id: "cycles",
    short: "-c",
    long: "-c",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Number of pings in report mode",
    detail: "Number of pings in report mode",
    order: 20,
    arg: {
      placeholder: "10",
      separator: " ",
    },
  },
  {
    id: "noDns",
    short: "-n",
    long: "--no-dns",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Do not resolve hostnames",
    detail: "Do not resolve hostnames",
    order: 30,
  },
  {
    id: "tcp",
    short: "-T",
    long: "--tcp",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Use TCP instead of ICMP",
    detail: "Use TCP instead of ICMP",
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
