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
    id: "automatic",
    short: "-a",
    long: "-a",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Automatically repair",
    detail: "Automatically repair",
    order: 10,
  },
  {
    id: "noAction",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Do not make changes",
    detail: "Do not make changes",
    order: 20,
  },
  {
    id: "force",
    short: "-f",
    long: "-f",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Force checking",
    detail: "Force checking",
    order: 30,
  },
  {
    id: "type",
    short: "-t",
    long: "-t",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Specify filesystem type",
    detail: "Specify filesystem type",
    order: 40,
    arg: {
      placeholder: "ext4",
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
