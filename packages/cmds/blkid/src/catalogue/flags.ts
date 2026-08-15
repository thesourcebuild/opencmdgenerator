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
    id: "matchTag",
    short: "-s",
    // Rendered as the short form regardless — `renderFlag` always uses
    // `long` for text-kind flags (preferShort only affects boolean/enum
    // kinds), same workaround `@cmdgen/mount`'s `-t`/`-o` use.
    long: "-s",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "UUID", separator: " " },
    summary: "Only show the value of this one tag (e.g. UUID, LABEL, TYPE).",
    detail: "Narrows output to a single tag instead of every tag blkid knows about the device.",
    order: 10,
  },
  {
    id: "output",
    short: "-o",
    long: "-o",
    group: "options",
    kind: "enum",
    options: [
      // "none" is the engine's inactive-enum sentinel — see `isFlagActive`.
      { value: "none", label: "Full (default)", renders: "" },
      { value: "value", label: "Value only", renders: "-o value" },
      { value: "device", label: "Device name only", renders: "-o device" },
      { value: "list", label: "Table (list)", renders: "-o list" },
      { value: "udev", label: "udev-style KEY=VALUE", renders: "-o udev" },
    ],
    summary: "How to format the output.",
    detail: "\"Full\" (the default) prints every tag as NAME=\"value\" pairs; the others narrow or reshape that.",
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
