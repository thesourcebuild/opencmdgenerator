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
import type { ExportPlatform } from "../spec";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

export const FLAGS: readonly FlagDef[] = [
  {
    id: "printAll",
    short: "-p",
    long: "-p",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    conflictsWith: ["removeExport"],
    summary: "List every exported variable, in a form that can be reused as input.",
    detail: "Ignores the name/value below entirely — this is a display mode, not a way to set anything.",
    order: 10,
  },
  {
    id: "removeExport",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    conflictsWith: ["printAll"],
    summary: "Remove the export attribute from the named variable, instead of setting one.",
    detail: "The variable keeps its value in the current shell — it just stops being passed to child processes.",
    order: 20,
  },
  {
    id: "isFunction",
    short: "-f",
    long: "-f",
    group: "options",
    kind: "boolean",
    preferShort: true,
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Treat the name as a shell function, not a variable.",
    detail: "Exports a shell function to child processes, rather than a variable.",
    order: 30,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function isAvailableOn(flag: FlagDef, platform: ExportPlatform): boolean {
  return isAvailableOnGeneric(flag, platform);
}

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
