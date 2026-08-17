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
    id: "shell",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "path",
    preferShort: true,
    summary: "Set login shell",
    detail: "Set login shell",
    order: 10,
    arg: {
      placeholder: "/bin/zsh",
      separator: " ",
    },
  },
  {
    id: "listShells",
    short: "-l",
    long: "--list-shells",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "List valid shells",
    detail: "List valid shells",
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
