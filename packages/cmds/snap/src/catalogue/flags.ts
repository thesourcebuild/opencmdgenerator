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
    id: "classic",
    long: "--classic",
    group: "options",
    kind: "boolean",
    summary: "Use classic confinement",
    detail: "Use classic confinement",
    order: 10,
  },
  {
    id: "channel",
    long: "--channel",
    group: "options",
    kind: "text",
    summary: "Select channel",
    detail: "Select channel",
    order: 20,
    arg: {
      placeholder: "latest/stable",
      separator: " ",
    },
  },
  {
    id: "dangerous",
    long: "--dangerous",
    group: "options",
    kind: "boolean",
    summary: "Install unsigned local snap",
    detail: "Install unsigned local snap",
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
