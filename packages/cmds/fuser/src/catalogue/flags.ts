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
    id: "kill",
    short: "-k",
    long: "--kill",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Kill processes accessing the file",
    detail: "Kill processes accessing the file",
    order: 10,
  },
  {
    id: "verbose",
    short: "-v",
    long: "--verbose",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Verbose output",
    detail: "Verbose output",
    order: 20,
  },
  {
    id: "mount",
    short: "-m",
    long: "--mount",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show processes using a mounted filesystem",
    detail: "Show processes using a mounted filesystem",
    order: 30,
  },
  {
    id: "namespace",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Select namespace",
    detail: "Select namespace",
    order: 40,
    arg: {
      placeholder: "tcp",
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
