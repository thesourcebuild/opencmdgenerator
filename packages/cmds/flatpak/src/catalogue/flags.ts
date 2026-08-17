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
    id: "user",
    long: "--user",
    group: "options",
    kind: "boolean",
    summary: "Install for the current user",
    detail: "Install for the current user",
    order: 10,
  },
  {
    id: "system",
    long: "--system",
    group: "options",
    kind: "boolean",
    summary: "Install system-wide",
    detail: "Install system-wide",
    order: 20,
  },
  {
    id: "assumeyes",
    short: "-y",
    long: "--assumeyes",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Answer yes to prompts",
    detail: "Answer yes to prompts",
    order: 30,
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
