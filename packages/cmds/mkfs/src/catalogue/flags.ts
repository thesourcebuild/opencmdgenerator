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

/**
 * `filesystemType` (`-t`) is a spec-level field, not a catalogue flag here —
 * same split `@cmdgen/mount` uses, except mount's `-t` stays a flag while
 * mkfs's is common and central enough to warrant its own field (see
 * `spec.ts` and `argv/index.ts`).
 */
export const FLAGS: readonly FlagDef[] = [
  {
    id: "check",
    short: "-c",
    long: "-c",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Check the device for bad blocks before formatting it.",
    detail: "Slower — reads (and for some filesystem types, writes) every block first. Does not itself make the format any less destructive.",
    order: 10,
  },
  {
    id: "label",
    short: "-L",
    // Rendered as the short form regardless — `renderFlag` always uses
    // `long` for text-kind flags (preferShort only affects boolean/enum
    // kinds), same workaround `@cmdgen/mount`'s `-t`/`-o` use.
    long: "-L",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "mydata", separator: " " },
    summary: "Set the new filesystem's volume label.",
    detail: "Purely cosmetic metadata — has no effect on what gets erased.",
    order: 20,
  },
  {
    id: "force",
    short: "-F",
    long: "-F",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "destructive",
    summary: "Force formatting even if the device looks mounted or isn't a normal block device.",
    detail: "Bypasses mkfs's own sanity checks — the usual first line of defense against formatting the wrong (possibly in-use) device.",
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
