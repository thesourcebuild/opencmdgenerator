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
    id: "type",
    short: "-t",
    long: "-t",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "ext4", separator: " " },
    summary: "Specify the filesystem type explicitly.",
    detail: "Without this, mount tries to detect the type automatically. Common values: ext4, xfs, nfs, cifs, tmpfs.",
    order: 10,
  },
  {
    id: "options",
    short: "-o",
    long: "-o",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "ro,noexec", separator: " " },
    summary: "Comma-separated mount options.",
    detail: "Common options: ro (read-only), rw (read-write, the default), noexec, nosuid, noatime.",
    order: 20,
  },
  {
    id: "readOnly",
    short: "-r",
    long: "-r",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Mount read-only.",
    detail: "Shorthand for -o ro — use one or the other, not both, though this app does not enforce that.",
    order: 30,
  },
  {
    id: "bind",
    long: "--bind",
    group: "options",
    kind: "boolean",
    summary: "Create a bind mount instead of mounting a device.",
    detail: "Re-mounts an existing directory at a second location; the device field should be the source directory, not a block device. Linux only.",
    order: 40,
  },
  {
    id: "verbose",
    short: "-v",
    long: "-v",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Describe what's being done.",
    detail: "Prints each step mount takes, useful when a mount fails and you need to see why.",
    order: 50,
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
