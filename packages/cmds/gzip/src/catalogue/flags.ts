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
    id: "decompress",
    short: "-d",
    long: "--decompress",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Decompress instead of compress.",
    detail: "Equivalent to running gunzip on the same files.",
    order: 10,
  },
  {
    id: "keep",
    short: "-k",
    long: "--keep",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Keep the original file instead of deleting it.",
    detail:
      "gzip deletes each input file after compressing (or decompressing) it by default. This flag is the only thing that stops that — see the caution in the diagnostics panel when it's off.",
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
    summary: "Force compression even if the output file already exists.",
    detail:
      "Without this, gzip refuses to overwrite an existing file.gz (or existing decompressed output with -d) and asks first. -f skips that check and overwrites silently.",
    order: 30,
  },
  {
    id: "recursive",
    short: "-r",
    long: "--recursive",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Recurse into directories.",
    detail: "Descends into any directory named among the files, compressing (or decompressing) everything found inside.",
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
