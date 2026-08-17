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
    id: "install",
    short: "-i",
    long: "-i",
    group: "options",
    kind: "path",
    preferShort: true,
    summary: "Install a .deb package",
    detail: "Install a .deb package",
    order: 10,
    arg: {
      placeholder: "package.deb",
      separator: " ",
    },
  },
  {
    id: "remove",
    short: "-r",
    long: "-r",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Remove a package",
    detail: "Remove a package",
    order: 20,
    arg: {
      placeholder: "nginx",
      separator: " ",
    },
  },
  {
    id: "list",
    short: "-l",
    long: "--list",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "List packages",
    detail: "List packages",
    order: 30,
  },
  {
    id: "contents",
    short: "-L",
    long: "-L",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "List files in a package",
    detail: "List files in a package",
    order: 40,
    arg: {
      placeholder: "nginx",
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
