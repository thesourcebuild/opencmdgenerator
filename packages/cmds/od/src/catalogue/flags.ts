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
    id: "hex",
    short: "-x",
    long: "-x",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Output two-byte hexadecimal units",
    detail: "Output two-byte hexadecimal units",
    order: 10,
  },
  {
    id: "chars",
    short: "-c",
    long: "-c",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Output characters",
    detail: "Output characters",
    order: 20,
  },
  {
    id: "addressRadix",
    short: "-A",
    long: "-A",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Select address radix",
    detail: "Select address radix",
    order: 30,
    arg: {
      placeholder: "x",
      separator: " ",
    },
  },
  {
    id: "type",
    short: "-t",
    long: "-t",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Select output format",
    detail: "Select output format",
    order: 40,
    arg: {
      placeholder: "x1",
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
