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
    id: "list",
    short: "-l",
    long: "-l",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "List partition table",
    detail: "List partition table",
    order: 10,
  },
  {
    id: "verify",
    short: "-v",
    long: "-v",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Verify disk",
    detail: "Verify disk",
    order: 20,
  },
  {
    id: "backup",
    short: "-b",
    long: "-b",
    group: "options",
    kind: "path",
    preferShort: true,
    summary: "Back up partition data",
    detail: "Back up partition data",
    order: 30,
    arg: {
      placeholder: "table.gpt",
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
