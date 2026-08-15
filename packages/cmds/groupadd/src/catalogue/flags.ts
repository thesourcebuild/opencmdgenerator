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
    summary: "Use this specific numeric group ID instead of the next available one.",
    detail: "Must be unique unless combined with a flag allowing duplicates (not modeled here).",
    order: 10,
  },
  {
    id: "system",
    short: "-r",
    long: "--system",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Create a system group instead of a normal group.",
    detail: "Takes a GID from the system range instead of the normal range — typical for groups created by packages/services rather than by an admin for people.",
    order: 20,
  },
  {
    id: "force",
    short: "-f",
    long: "--force",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "caution",
    summary: "Exit successfully if the group already exists.",
    detail:
      "Makes repeated/idempotent invocations safe. When combined with -g and that GID is already taken, groupadd silently picks a different (unique) GID instead of failing — -g is effectively turned off in that case.",
    order: 30,
  },
  {
    id: "key",
    short: "-K",
    long: "-K",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "GID_MIN=5000", separator: " " },
    summary: "Override a single /etc/login.defs default for this invocation only.",
    detail: "Format is KEY=VALUE, e.g. GID_MIN=5000. Does not change the system-wide default in /etc/login.defs.",
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
