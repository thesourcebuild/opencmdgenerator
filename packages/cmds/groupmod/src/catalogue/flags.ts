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
  // ── options ───────────────────────────────────────────────────────────────
  {
    id: "gid",
    short: "-g",
    // Rendered as its short form only — same modeling choice as `@cmdgen/useradd`'s
    // `-u`, since `buildFlagArgs` always renders a text-kind flag's `long` field
    // regardless of `preferShort` (that switch only affects boolean/enum flags).
    long: "-g",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "5000", separator: " " },
    summary: "Change the group's GID to this value.",
    detail: "The new GID must be unique unless -o is also given.",
    order: 10,
  },
  {
    id: "newName",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "engineering", separator: " " },
    summary: "Rename the group to this new name.",
    detail: "Only the group's name changes — its GID and membership are untouched.",
    order: 20,
  },
  {
    id: "nonUnique",
    short: "-o",
    long: "--non-unique",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "caution",
    requires: ["gid"],
    summary: "Allow the new GID to duplicate an existing group's GID.",
    detail:
      "Only meaningful together with -g. Two groups sharing one GID can confuse tools that assume a 1:1 mapping between group names and GIDs — use deliberately, not by default.",
    order: 30,
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
