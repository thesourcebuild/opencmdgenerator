import {
  createFlagCatalogue,
  flagLabel as flagLabelGeneric,
  isAvailableOn as isAvailableOnGeneric,
  type DangerLevel,
  type FlagArgSpec,
  type FlagDef as FlagDefGeneric,
  type FlagEnumOption,
  type FlagKind,
} from "@cmdgen/engine";
import type { FlagGroup } from "./groups";
import type { PwdPlatform } from "../spec";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

export const FLAGS: readonly FlagDef[] = [
  {
    id: "symlinkMode",
    long: "-L/-P",
    group: "options",
    kind: "enum",
    availableOn: ["posix"],
    options: [
      { value: "none", label: "Default behavior", renders: "" },
      { value: "logical", label: "Logical (-L)", renders: "-L" },
      { value: "physical", label: "Physical (-P)", renders: "-P" },
    ],
    summary: "How to resolve symlinks in the printed path.",
    detail:
      "-L (logical) prints $PWD as the shell tracks it, symlinks and all — the default on most shells. -P (physical) resolves every symlink first, so the printed path never contains one.",
    order: 10,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function isAvailableOn(flag: FlagDef, platform: PwdPlatform): boolean {
  return isAvailableOnGeneric(flag, platform);
}

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
