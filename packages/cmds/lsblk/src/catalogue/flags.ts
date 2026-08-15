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
    id: "fs",
    short: "-f",
    long: "--fs",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Output info about filesystems (FSTYPE, LABEL, UUID, MOUNTPOINT).",
    detail: "Shorthand for -o NAME,FSTYPE,LABEL,UUID,MOUNTPOINT.",
    order: 10,
  },
  {
    id: "all",
    short: "-a",
    long: "--all",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print all devices, including empty ones.",
    detail: "Without this, lsblk hides devices it considers empty (e.g. an empty optical drive).",
    order: 20,
  },
  {
    id: "output",
    short: "-o",
    // Rendered as the short form regardless — `renderFlag` always uses
    // `long` for text-kind flags (preferShort only affects boolean/enum
    // kinds), same workaround `@cmdgen/mount`'s `-t`/`-o` use.
    long: "-o",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "NAME,SIZE,TYPE,MOUNTPOINT", separator: " " },
    summary: "Comma-separated list of columns to show.",
    detail: "Without this, lsblk shows its own default column set (NAME, MAJ:MIN, RM, SIZE, RO, TYPE, MOUNTPOINTS).",
    order: 30,
  },
  {
    id: "paths",
    short: "-p",
    long: "--paths",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print full device paths (/dev/sda) instead of short device names.",
    detail: "Useful when piping the output into another command that expects a real device path.",
    order: 40,
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
