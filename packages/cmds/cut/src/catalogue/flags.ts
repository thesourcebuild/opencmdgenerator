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
    id: "delimiter",
    // `long` set to the short spelling itself (same trick as @cmdgen/sort's
    // -t) so the generic text-flag renderer, which always emits `def.long`,
    // produces the short form real-world usage actually reads.
    short: "-d",
    long: "-d",
    group: "options",
    kind: "text",
    arg: { placeholder: ",", separator: " " },
    requires: ["fields"],
    summary: "Use this character as the field delimiter, instead of TAB.",
    detail: "Only has an effect together with -f — cut's -c and -b work on fixed character/byte positions, not delimited fields.",
    order: 10,
  },
  {
    // `long` set to the short spelling itself — same trick as -d above.
    id: "fields",
    short: "-f",
    long: "-f",
    group: "options",
    kind: "text",
    arg: { placeholder: "1,3-5", separator: " " },
    conflictsWith: ["characters", "bytes"],
    summary: "Select these fields (e.g. \"1,3-5\").",
    detail: "Fields are delimited by TAB by default, or by -d's character.",
    order: 20,
  },
  {
    id: "characters",
    short: "-c",
    long: "-c",
    group: "options",
    kind: "text",
    arg: { placeholder: "1-4", separator: " " },
    conflictsWith: ["fields", "bytes"],
    summary: "Select these character positions (e.g. \"1-4\").",
    detail: "Counts characters, not bytes — matters for multi-byte encodings.",
    order: 30,
  },
  {
    id: "bytes",
    short: "-b",
    long: "-b",
    group: "options",
    kind: "text",
    arg: { placeholder: "1-4", separator: " " },
    conflictsWith: ["fields", "characters"],
    summary: "Select these byte positions (e.g. \"1-4\").",
    detail: "Counts raw bytes — can split a multi-byte character in the middle.",
    order: 40,
  },
  {
    id: "complement",
    long: "--complement",
    group: "options",
    kind: "boolean",
    summary: "Invert the selection — output everything EXCEPT the selected fields/characters/bytes.",
    detail: "Combines with whichever of -f, -c, or -b is set.",
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
