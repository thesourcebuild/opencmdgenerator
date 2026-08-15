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

// Real unzip also has -a/-aa (text-file auto-conversion), -X/-V (VMS/UID-GID
// metadata restore), -K/-M (setuid permissions/pager output), -O/-I (legacy
// DOS/OS2 charset selection), and -T (archive timestamping) — all omitted
// here as obscure, platform-specific options that see little real-world use;
// the flags below cover the actions and modifiers documented at the top of
// `unzip -h`, which is the realistic majority of everyday usage.
const MODE_FLAG_IDS = ["list", "test", "verboseList", "extractToPipe", "freshen", "update", "commentOnly"] as const;

export const FLAGS: readonly FlagDef[] = [
  // ── mode — at most one; default (none of these) is a plain extract ─────────
  {
    id: "list",
    short: "-l",
    long: "-l",
    group: "mode",
    kind: "boolean",
    preferShort: true,
    conflictsWith: MODE_FLAG_IDS.filter((id) => id !== "list"),
    summary: "List the archive's contents without extracting.",
    detail: "Shows file names, sizes, and dates; nothing is written to disk. Mutually exclusive with every other mode.",
    order: 10,
  },
  {
    id: "test",
    short: "-t",
    long: "-t",
    group: "mode",
    kind: "boolean",
    preferShort: true,
    conflictsWith: MODE_FLAG_IDS.filter((id) => id !== "test"),
    summary: "Test the archive's integrity without extracting.",
    detail: "Verifies each entry's checksum; reports the first corrupt entry it finds. Nothing is written to disk.",
    order: 20,
  },
  {
    id: "verboseList",
    short: "-v",
    long: "-v",
    group: "mode",
    kind: "boolean",
    preferShort: true,
    conflictsWith: MODE_FLAG_IDS.filter((id) => id !== "verboseList"),
    summary: "List the archive's contents verbosely.",
    detail: "Like -l, but with more detail per entry (compression method, ratio, CRC).",
    order: 30,
  },
  {
    id: "extractToPipe",
    short: "-p",
    long: "-p",
    group: "mode",
    kind: "boolean",
    preferShort: true,
    conflictsWith: MODE_FLAG_IDS.filter((id) => id !== "extractToPipe"),
    summary: "Extract files to stdout instead of writing them to disk.",
    detail: "Also implies quiet mode — no informational messages are mixed into the extracted bytes.",
    order: 40,
  },
  {
    id: "freshen",
    short: "-f",
    long: "-f",
    group: "mode",
    kind: "boolean",
    preferShort: true,
    conflictsWith: MODE_FLAG_IDS.filter((id) => id !== "freshen"),
    summary: "Freshen existing files only — never creates new ones.",
    detail: "Only overwrites a file already present on disk, and only when the archive's copy is newer.",
    order: 50,
  },
  {
    id: "update",
    short: "-u",
    long: "-u",
    group: "mode",
    kind: "boolean",
    preferShort: true,
    conflictsWith: MODE_FLAG_IDS.filter((id) => id !== "update"),
    summary: "Update existing files and create any that are missing.",
    detail: "Like freshen (-f), but also extracts entries that don't exist on disk yet.",
    order: 60,
  },
  {
    id: "commentOnly",
    short: "-z",
    long: "-z",
    group: "mode",
    kind: "boolean",
    preferShort: true,
    conflictsWith: MODE_FLAG_IDS.filter((id) => id !== "commentOnly"),
    summary: "Display only the archive's comment.",
    detail: "Prints the archive-level comment, if any, and does nothing else.",
    order: 70,
  },

  // ── options ───────────────────────────────────────────────────────────────
  {
    id: "overwrite",
    short: "-o",
    long: "-o",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["neverOverwrite"],
    summary: "Overwrite existing files without prompting.",
    detail: "Without this, unzip asks for confirmation before replacing a file that already exists.",
    order: 80,
  },
  {
    id: "neverOverwrite",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["overwrite"],
    summary: "Never overwrite existing files.",
    detail: "Silently skips any entry whose target file already exists — the opposite of -o.",
    order: 90,
  },
  {
    id: "quiet",
    short: "-q",
    long: "-q",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["veryQuiet"],
    summary: "Suppress most output.",
    detail: "Only errors and prompts are still printed.",
    order: 100,
  },
  {
    id: "veryQuiet",
    short: "-qq",
    long: "-qq",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["quiet"],
    summary: "Suppress nearly all output — quieter than -q.",
    detail: "Even quieter than plain -q. Mutually exclusive with it — pass one or the other, not both.",
    order: 110,
  },
  {
    id: "junkPaths",
    short: "-j",
    long: "-j",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Junk paths — extract every entry directly into the target directory.",
    detail: "Discards any directory structure recorded in the archive; all files land in one flat directory.",
    order: 120,
  },
  {
    id: "caseInsensitive",
    short: "-C",
    long: "-C",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Match filenames case-insensitively.",
    detail: "Affects how the files list and -x exclusions are matched against archive entry names.",
    order: 130,
  },
  {
    id: "lowercaseNames",
    short: "-L",
    long: "-L",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Convert extracted filenames to lowercase.",
    detail: "Useful for archives created on a case-preserving filesystem that should extract as all-lowercase.",
    order: 140,
  },
  {
    id: "password",
    short: "-P",
    long: "-P",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "secret", separator: " " },
    summary: "Decrypt password-protected entries with this password.",
    detail: "Passed on the command line in plain text — visible in shell history and process listings on most systems.",
    order: 150,
  },
  {
    id: "directory",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "output/", separator: " " },
    summary: "Extract into this directory instead of the current one.",
    detail: "The directory is created if it doesn't already exist.",
    order: 160,
  },
  {
    id: "exclude",
    short: "-x",
    long: "-x",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "*.log", separator: " " },
    summary: "Exclude entries matching this pattern from extraction.",
    detail: "Accepts a shell glob pattern; matching entries are skipped.",
    order: 170,
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
