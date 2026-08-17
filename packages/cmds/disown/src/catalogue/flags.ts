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
    id: "all",
    short: "-a",
    long: "-a",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Disown all jobs",
    detail: "Disown all jobs",
    order: 10,
  },
  {
    id: "running",
    short: "-r",
    long: "-r",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Disown running jobs only",
    detail: "Disown running jobs only",
    order: 20,
  },
  {
    id: "noHup",
    short: "-h",
    long: "-h",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Mark jobs so SIGHUP is not sent",
    detail: "Mark jobs so SIGHUP is not sent",
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
