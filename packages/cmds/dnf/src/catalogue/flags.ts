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
    id: "assumeYes",
    short: "-y",
    long: "--assumeyes",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Answer yes to prompts",
    detail: "Answer yes to prompts",
    order: 10,
  },
  {
    id: "refresh",
    long: "--refresh",
    group: "options",
    kind: "boolean",
    summary: "Refresh metadata",
    detail: "Refresh metadata",
    order: 20,
  },
  {
    id: "disableRepo",
    long: "--disablerepo",
    group: "options",
    kind: "text",
    summary: "Disable a repository",
    detail: "Disable a repository",
    order: 30,
    arg: {
      placeholder: "updates",
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
