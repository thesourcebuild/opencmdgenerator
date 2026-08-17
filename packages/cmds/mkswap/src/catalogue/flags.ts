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
    id: "check",
    short: "-c",
    long: "--check",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Check device for bad blocks",
    detail: "Check device for bad blocks",
    order: 10,
  },
  {
    id: "label",
    short: "-L",
    long: "-L",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Set swap label",
    detail: "Set swap label",
    order: 20,
    arg: {
      placeholder: "SWAP",
      separator: " ",
    },
  },
  {
    id: "uuid",
    short: "-U",
    long: "-U",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Set swap UUID",
    detail: "Set swap UUID",
    order: 30,
    arg: {
      placeholder: "random",
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
