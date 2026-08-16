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
    id: "batch",
    short: "-b",
    long: "-b",
    group: "options",
    kind: "path",
    preferShort: true,
    summary: "Read commands from a batch file",
    detail: "Read commands from a batch file",
    order: 10,
    arg: {
      placeholder: "batch.txt",
      separator: " ",
    },
  },
  {
    id: "port",
    short: "-P",
    long: "-P",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Connect to a specific port",
    detail: "Connect to a specific port",
    order: 20,
    arg: {
      placeholder: "2222",
      separator: " ",
    },
  },
  {
    id: "preserve",
    short: "-p",
    long: "-p",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Preserve file permissions and times",
    detail: "Preserve file permissions and times",
    order: 30,
  },
  {
    id: "quiet",
    short: "-q",
    long: "-q",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Quiet mode",
    detail: "Quiet mode",
    order: 40,
  },
  {
    id: "recursive",
    short: "-r",
    long: "-r",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Recursively copy directories",
    detail: "Recursively copy directories",
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
