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
    id: "followForks",
    short: "-f",
    long: "-f",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Follow forks",
    detail: "Follow forks",
    order: 10,
  },
  {
    id: "output",
    short: "-o",
    long: "-o",
    group: "options",
    kind: "path",
    preferShort: true,
    summary: "Write trace to a file",
    detail: "Write trace to a file",
    order: 20,
    arg: {
      placeholder: "ltrace.log",
      separator: " ",
    },
  },
  {
    id: "pid",
    short: "-p",
    long: "-p",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Attach to a PID",
    detail: "Attach to a PID",
    order: 30,
    arg: {
      placeholder: "1234",
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
