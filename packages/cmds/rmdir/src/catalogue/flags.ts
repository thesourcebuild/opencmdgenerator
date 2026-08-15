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
    id: "parents",
    short: "-p",
    long: "--parents",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Remove the directory, then each parent component of the path in turn, as long as it's empty too.",
    detail:
      "Turns \"rmdir a/b/c\" into removing c, then b, then a — but stops (without error) at the first parent that isn't empty.",
    order: 10,
  },
  {
    id: "ignoreFailOnNonEmpty",
    long: "--ignore-fail-on-non-empty",
    group: "options",
    kind: "boolean",
    summary: "Don't report an error when the only reason a directory couldn't be removed is that it wasn't empty.",
    detail: "Every other failure (permissions, doesn't exist, ...) still errors normally — this only silences the \"directory not empty\" case.",
    order: 20,
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
