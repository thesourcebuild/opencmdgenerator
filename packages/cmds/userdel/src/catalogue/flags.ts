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
    id: "removeHome",
    short: "-r",
    long: "--remove",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Remove the user's home directory and mail spool",
    detail: "Remove the user's home directory and mail spool",
    order: 10,
    danger: "destructive",
  },
  {
    id: "force",
    short: "-f",
    long: "--force",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Force removal",
    detail: "Force removal",
    order: 20,
    danger: "destructive",
  },
  {
    id: "selinuxUser",
    short: "-Z",
    long: "--selinux-user",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Remove SELinux user mapping",
    detail: "Remove SELinux user mapping",
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
