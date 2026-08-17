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
    id: "static",
    short: "--static",
    long: "--static",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show or set static hostname",
    detail: "Show or set static hostname",
    order: 10,
  },
  {
    id: "transient",
    short: "--transient",
    long: "--transient",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show or set transient hostname",
    detail: "Show or set transient hostname",
    order: 20,
  },
  {
    id: "pretty",
    short: "--pretty",
    long: "--pretty",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show or set pretty hostname",
    detail: "Show or set pretty hostname",
    order: 30,
  },
  {
    id: "noAskPassword",
    long: "--no-ask-password",
    group: "options",
    kind: "boolean",
    summary: "Do not prompt for authentication",
    detail: "Do not prompt for authentication",
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
