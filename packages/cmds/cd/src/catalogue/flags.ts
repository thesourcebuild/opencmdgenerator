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
import type { CdPlatform } from "../spec";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

export const FLAGS: readonly FlagDef[] = [
  {
    id: "symlinkMode",
    long: "--symlink-mode",
    group: "options",
    kind: "enum",
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    options: [
      { value: "none", label: "Default behavior", renders: "" },
      { value: "logical", label: "Logical (-L)", renders: "-L" },
      { value: "physical", label: "Physical (-P)", renders: "-P" },
    ],
    summary: "How to resolve symlinks when changing directory.",
    detail:
      "-L (logical, the default) keeps symlinks in $PWD as typed. -P (physical) resolves them before changing, so $PWD holds the real path.",
    order: 10,
  },
  {
    id: "errorIfCwdUnavailable",
    long: "-e",
    group: "options",
    kind: "boolean",
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    requires: ["symlinkMode"],
    summary: "Error if the new working directory cannot be determined.",
    detail:
      "Only meaningful with physical mode (-P). Combine so a failure to resolve the real path is reported instead of silently succeeding.",
    order: 20,
  },
  {
    id: "extendedAttributes",
    long: "-@",
    group: "options",
    kind: "boolean",
    availableOn: ["linux", "mac", "windows-cygwin", "windows-msys", "windows-wsl"],
    summary: "Treat a file's extended attributes as a directory.",
    detail: "On systems that support it (macOS), presents extended attributes as a browsable directory.",
    order: 30,
  },
  {
    id: "switchDrive",
    long: "/d",
    group: "options",
    kind: "boolean",
    availableOn: ["windows-cmd"],
    summary: "Also switch the current drive.",
    detail:
      "cmd.exe's cd normally changes the directory on the current drive only. /d also switches drives, e.g. from C: to D:.",
    order: 10,
  },
  {
    id: "literalPath",
    long: "-LiteralPath",
    group: "options",
    kind: "boolean",
    availableOn: ["windows-powershell"],
    summary: "Treat the path literally — no wildcard expansion.",
    detail: "Use when the path itself may contain characters PowerShell would otherwise treat as wildcards.",
    order: 10,
  },
  {
    id: "passThru",
    long: "-PassThru",
    group: "options",
    kind: "boolean",
    availableOn: ["windows-powershell"],
    summary: "Return an object representing the new location.",
    detail: "Useful when the command is piped into something else rather than run interactively.",
    order: 20,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function isAvailableOn(flag: FlagDef, platform: CdPlatform): boolean {
  return isAvailableOnGeneric(flag, platform);
}

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
