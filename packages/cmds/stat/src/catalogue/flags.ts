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
    id: "fileSystem",
    short: "-f",
    long: "--file-system",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show file system status",
    detail: "Show file system status",
    order: 10,
  },
  {
    id: "dereference",
    short: "-L",
    long: "--dereference",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Follow symbolic links",
    detail: "Follow symbolic links",
    order: 20,
  },
  {
    id: "terse",
    short: "-t",
    long: "--terse",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print terse output",
    detail: "Print terse output",
    order: 30,
  },
  {
    id: "format",
    short: "-c",
    long: "-c",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Use a custom output format",
    detail: "Use a custom output format",
    order: 40,
    arg: {
      placeholder: "%n %s",
      separator: " ",
    },
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
