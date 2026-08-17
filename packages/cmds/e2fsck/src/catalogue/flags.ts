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
    id: "force",
    short: "-f",
    long: "-f",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Force checking",
    detail: "Force checking",
    order: 10,
  },
  {
    id: "preen",
    short: "-p",
    long: "-p",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Automatically repair safely",
    detail: "Automatically repair safely",
    order: 20,
  },
  {
    id: "yes",
    short: "-y",
    long: "-y",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Assume yes to all questions",
    detail: "Assume yes to all questions",
    order: 30,
  },
  {
    id: "no",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Open read-only and answer no",
    detail: "Open read-only and answer no",
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
