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
    id: "canonicalizeExisting",
    short: "-e",
    long: "--canonicalize-existing",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Require every path component to exist",
    detail: "Require every path component to exist",
    order: 10,
  },
  {
    id: "canonicalizeMissing",
    short: "-m",
    long: "--canonicalize-missing",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Allow missing path components",
    detail: "Allow missing path components",
    order: 20,
  },
  {
    id: "noSymlinks",
    short: "-s",
    long: "--strip",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Do not expand symlinks",
    detail: "Do not expand symlinks",
    order: 30,
  },
  {
    id: "relativeTo",
    long: "--relative-to",
    group: "options",
    kind: "path",
    summary: "Print paths relative to a directory",
    detail: "Print paths relative to a directory",
    order: 40,
    arg: {
      placeholder: "/repo",
      separator: " ",
    },
  },
  {
    id: "relativeBase",
    long: "--relative-base",
    group: "options",
    kind: "path",
    summary: "Print absolute paths unless below a base",
    detail: "Print absolute paths unless below a base",
    order: 50,
    arg: {
      placeholder: "/repo",
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
