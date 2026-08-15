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
    id: "verbose",
    short: "-v",
    long: "--verbose",
    group: "output",
    kind: "boolean",
    preferShort: true,
    summary: "Report on every file processed, changed or not.",
    detail: "Describes the action or non-action taken for every file.",
    order: 10,
  },
  {
    id: "recursive",
    short: "-R",
    long: "--recursive",
    group: "options",
    kind: "boolean",
    preferShort: true,
    // Same caution treatment as @cmdgen/chown's own --recursive: applies to
    // every file and directory under each listed path, not just the paths
    // themselves — easy to affect far more than intended.
    danger: "caution",
    summary: "Recursively change the group of directories and their contents.",
    detail: "Applies the new group to every file and directory under each listed path, not just the paths themselves.",
    order: 10,
  },
  {
    id: "reference",
    long: "--reference",
    group: "options",
    kind: "path",
    arg: { placeholder: "ref_file.txt", separator: "=" },
    summary: "Copy the group from another file instead of specifying one directly.",
    detail: "Mutually exclusive with giving an explicit group — chgrp accepts a group or --reference=ref_file, never both.",
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
