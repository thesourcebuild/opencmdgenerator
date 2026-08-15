import {
  createFlagCatalogue,
  flagLabel as flagLabelGeneric,
  isUnavailable as isUnavailableGeneric,
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
  // ── output ────────────────────────────────────────────────────────────────
  {
    id: "changes",
    short: "-c",
    long: "--changes",
    group: "output",
    kind: "boolean",
    preferShort: true,
    summary: "Report only when a file's permissions actually change.",
    detail: "Like --verbose but quieter — files that already had the requested mode are not mentioned.",
    order: 10,
  },
  {
    id: "verbose",
    short: "-v",
    long: "--verbose",
    group: "output",
    kind: "boolean",
    preferShort: true,
    summary: "Report on every file processed, changed or not.",
    detail: "Describes the action or non-action taken for every file, unlike --changes which only reports real changes.",
    order: 20,
  },
  {
    id: "silent",
    short: "-f",
    long: "--silent",
    group: "output",
    kind: "boolean",
    preferShort: true,
    summary: "Suppress most error messages.",
    detail: "\"--quiet\" is a documented synonym for this same flag — chmod accepts either spelling, this catalogue only renders --silent.",
    order: 30,
  },

  // ── options ───────────────────────────────────────────────────────────────
  {
    id: "dereference",
    long: "--dereference",
    group: "options",
    kind: "boolean",
    conflictsWith: ["noDereference"],
    danger: "caution",
    summary: "Act on what a symbolic link points to, not the link itself.",
    detail:
      "Already the default for command-line arguments — this mainly matters combined with --recursive, where it also affects symlinks encountered during traversal. Combining it with --recursive can let an attacker who controls a symlink target redirect the operation during traversal.",
    order: 110,
  },
  {
    id: "noDereference",
    short: "-h",
    long: "--no-dereference",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["dereference"],
    summary: "Act on symbolic links themselves, not what they point to.",
    detail: "Most systems ignore permissions on the link itself, so this is mainly useful to override a default that would otherwise dereference.",
    order: 120,
  },
  {
    id: "preserveRoot",
    long: "--preserve-root",
    group: "options",
    kind: "boolean",
    summary: "Refuse to recursively operate on /.",
    detail: "Only matters together with --recursive — a safety net against an accidental chmod -R / .",
    order: 130,
  },
  {
    id: "recursive",
    short: "-R",
    long: "--recursive",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "caution",
    summary: "Recursively change permissions of directories and their contents.",
    detail: "Applies the mode to every file and directory under each listed path, not just the paths themselves.",
    order: 140,
  },
  {
    id: "traversalMode",
    long: "-H/-L/-P",
    group: "options",
    kind: "enum",
    options: [
      { value: "none", label: "Default (-H behavior, without needing to write it)", renders: "" },
      { value: "H", label: "-H — traverse a command-line symlink to a directory", renders: "-H" },
      { value: "L", label: "-L — traverse every symlink to a directory encountered", renders: "-L" },
      { value: "P", label: "-P — never traverse any symbolic link", renders: "-P" },
    ],
    summary: "How --recursive treats symbolic links to directories during traversal.",
    detail:
      "Only meaningful together with --recursive. -L can let an attacker who controls a symlink target redirect the operation during traversal, the same risk --dereference carries.",
    order: 150,
  },
  {
    id: "reference",
    long: "--reference",
    group: "options",
    kind: "path",
    arg: { placeholder: "ref_file.txt", separator: "=" },
    summary: "Copy the mode from another file instead of specifying one directly.",
    detail: "Mutually exclusive with giving an explicit mode — chmod accepts a mode or --reference=ref_file, never both.",
    order: 160,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function isUnavailable(flag: FlagDef, targetVersion: number): boolean {
  return isUnavailableGeneric(flag, targetVersion);
}

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
