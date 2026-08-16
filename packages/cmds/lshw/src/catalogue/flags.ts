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
    id: "short",
    short: "-short",
    long: "-short",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show a compact hardware summary",
    detail: "Show a compact hardware summary",
    order: 10,
  },
  {
    id: "sanitize",
    short: "-sanitize",
    long: "-sanitize",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Remove sensitive information",
    detail: "Remove sensitive information",
    order: 20,
  },
  {
    id: "numeric",
    short: "-numeric",
    long: "-numeric",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show numeric IDs",
    detail: "Show numeric IDs",
    order: 30,
  },
  {
    id: "class",
    short: "-class",
    long: "-class",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Limit output to a hardware class",
    detail: "Limit output to a hardware class",
    order: 40,
    arg: {
      placeholder: "memory",
      separator: " ",
    },
  },
  {
    id: "json",
    short: "-json",
    long: "-json",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Output JSON",
    detail: "Output JSON",
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
