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
    id: "keep",
    short: "-k",
    long: "--keep",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Keep input files",
    detail: "Keep input files",
    order: 10,
  },
  {
    id: "force",
    short: "-f",
    long: "--force",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Force overwrite",
    detail: "Force overwrite",
    order: 20,
  },
  {
    id: "stdout",
    short: "-c",
    long: "--stdout",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Write to standard output",
    detail: "Write to standard output",
    order: 30,
  },
  {
    id: "test",
    short: "-t",
    long: "--test",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Test compressed file integrity",
    detail: "Test compressed file integrity",
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
