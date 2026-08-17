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
    summary: "Check sudoers syntax only",
    detail: "Check sudoers syntax only",
    order: 10,
  },
  {
    id: "file",
    short: "-f",
    long: "-f",
    group: "options",
    kind: "path",
    preferShort: true,
    summary: "Use an alternate sudoers file",
    detail: "Use an alternate sudoers file",
    order: 20,
    arg: {
      placeholder: "/etc/sudoers.d/admins",
      separator: " ",
    },
  },
  {
    id: "quiet",
    short: "-q",
    long: "--quiet",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Suppress details",
    detail: "Suppress details",
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
