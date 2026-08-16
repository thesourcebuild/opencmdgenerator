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
    id: "brief",
    short: "-b",
    long: "--brief",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Do not prepend filenames",
    detail: "Do not prepend filenames",
    order: 10,
  },
  {
    id: "mime",
    short: "-i",
    long: "--mime",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print MIME type information",
    detail: "Print MIME type information",
    order: 20,
  },
  {
    id: "dereference",
    short: "-L",
    long: "--dereference",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Follow symbolic links",
    detail: "Follow symbolic links",
    order: 30,
  },
  {
    id: "noDereference",
    short: "-h",
    long: "--no-dereference",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Do not follow symbolic links",
    detail: "Do not follow symbolic links",
    order: 40,
  },
  {
    id: "uncompress",
    short: "-z",
    long: "--uncompress",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Look inside compressed files",
    detail: "Look inside compressed files",
    order: 50,
  },
  {
    id: "filesFrom",
    short: "-f",
    long: "-f",
    group: "options",
    kind: "path",
    preferShort: true,
    summary: "Read filenames from a file",
    detail: "Read filenames from a file",
    order: 60,
    arg: {
      placeholder: "list.txt",
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
