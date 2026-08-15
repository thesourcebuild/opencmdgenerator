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
    id: "keep",
    short: "-k",
    long: "--keep",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["list"],
    summary: "Keep the .gz file instead of deleting it.",
    detail:
      "gunzip deletes each .gz file after decompressing it by default. This flag is the only thing that stops that — see the caution in the diagnostics panel when it's off. Meaningless together with -l, which never decompresses anything.",
    order: 10,
  },
  {
    id: "force",
    short: "-f",
    long: "--force",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "caution",
    summary: "Force decompression even if the output file already exists.",
    detail: "Without this, gunzip refuses to overwrite an existing decompressed file and asks first. -f skips that check and overwrites silently.",
    order: 20,
  },
  {
    id: "list",
    short: "-l",
    long: "--list",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["keep"],
    summary: "List each archive's compressed/uncompressed size and ratio without decompressing.",
    detail: "Nothing is written to disk and nothing is deleted — a safe, read-only way to inspect a .gz file.",
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
