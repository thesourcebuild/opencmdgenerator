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
    id: "interface",
    short: "-i",
    long: "-i",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Capture on an interface",
    detail: "Capture on an interface",
    order: 10,
    arg: {
      placeholder: "eth0",
      separator: " ",
    },
  },
  {
    id: "count",
    short: "-c",
    long: "-c",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Stop after this many packets",
    detail: "Stop after this many packets",
    order: 20,
    arg: {
      placeholder: "100",
      separator: " ",
    },
  },
  {
    id: "write",
    short: "-w",
    long: "-w",
    group: "options",
    kind: "path",
    preferShort: true,
    summary: "Write packets to a file",
    detail: "Write packets to a file",
    order: 30,
    arg: {
      placeholder: "capture.pcap",
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
    summary: "Do not resolve names",
    detail: "Do not resolve names",
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
