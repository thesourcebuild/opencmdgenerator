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
    id: "noHeader",
    short: "-h",
    long: "--no-header",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Do not print the header",
    detail: "Do not print the header",
    order: 10,
  },
  {
    id: "short",
    short: "-s",
    long: "--short",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Use short format",
    detail: "Use short format",
    order: 20,
  },
  {
    id: "from",
    short: "-f",
    long: "--from",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Toggle FROM field",
    detail: "Toggle FROM field",
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
