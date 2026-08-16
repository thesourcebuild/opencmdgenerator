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
    id: "userspec",
    long: "--userspec",
    group: "options",
    kind: "text",
    summary: "Run as a user and group",
    detail: "Run as a user and group",
    order: 10,
    arg: {
      placeholder: "user:group",
      separator: " ",
    },
  },
  {
    id: "groups",
    long: "--groups",
    group: "options",
    kind: "text",
    summary: "Specify supplementary groups",
    detail: "Specify supplementary groups",
    order: 20,
    arg: {
      placeholder: "group1,group2",
      separator: " ",
    },
  },
  {
    id: "skipChdir",
    long: "--skip-chdir",
    group: "options",
    kind: "boolean",
    summary: "Do not change working directory to /",
    detail: "Do not change working directory to /",
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
