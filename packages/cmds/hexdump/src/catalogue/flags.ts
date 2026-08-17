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
    id: "canonical",
    short: "-C",
    long: "-C",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Canonical hex plus ASCII display",
    detail: "Canonical hex plus ASCII display",
    order: 10,
  },
  {
    id: "length",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Read only this many bytes",
    detail: "Read only this many bytes",
    order: 20,
    arg: {
      placeholder: "64",
      separator: " ",
    },
  },
  {
    id: "skip",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Skip this many bytes",
    detail: "Skip this many bytes",
    order: 30,
    arg: {
      placeholder: "16",
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
