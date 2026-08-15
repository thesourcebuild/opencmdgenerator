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
  // GNU find documents -mindepth/-maxdepth as clearest when given before other
  // tests, even though the real parser accepts any order — order 10/20 here
  // simply puts them first in the generated command to match that convention.
  {
    id: "mindepth",
    long: "-mindepth",
    group: "filters",
    kind: "number",
    arg: { placeholder: "1", separator: " " },
    summary: "Don't apply tests or actions at levels shallower than this.",
    detail: "Depth 0 is the starting path itself; 1 is its immediate contents. Combine with -maxdepth to scan an exact band of the tree.",
    order: 10,
  },
  {
    id: "maxdepth",
    long: "-maxdepth",
    group: "filters",
    kind: "number",
    arg: { placeholder: "3", separator: " " },
    summary: "Never look deeper than this many levels below the starting path(s).",
    detail: "Depth 0 is the starting path itself.",
    order: 20,
  },
  {
    id: "type",
    long: "-type",
    group: "filters",
    kind: "enum",
    options: [
      { value: "f", label: "f — regular file", renders: "-type f" },
      { value: "d", label: "d — directory", renders: "-type d" },
      { value: "l", label: "l — symbolic link", renders: "-type l" },
    ],
    summary: "Only match entries of this type.",
    detail: "f = regular file, d = directory, l = symbolic link. Real find also matches sockets, pipes, and device files, which this app doesn't model.",
    order: 30,
  },
  {
    id: "name",
    long: "-name",
    group: "filters",
    kind: "text",
    arg: { placeholder: "*.log", separator: " " },
    summary: "Only match entries whose base name matches this shell glob pattern.",
    detail: "Case-sensitive. Quoted in the generated command so the shell doesn't expand the glob itself before find ever sees it.",
    order: 40,
  },
  {
    id: "mtime",
    long: "-mtime",
    group: "filters",
    kind: "number",
    arg: { placeholder: "7", separator: " " },
    summary: "Only match entries last modified exactly this many days ago.",
    detail: "Real find also accepts +N (more than N days ago) and -N (less than N days ago) — this app only models the exact-N form.",
    order: 50,
  },
  {
    id: "size",
    long: "-size",
    group: "filters",
    kind: "text",
    arg: { placeholder: "+100M", separator: " " },
    summary: "Only match entries of this size.",
    detail: "A bare number counts in 512-byte blocks; suffix with c (bytes), k (KiB), M (MiB), or G (GiB); prefix with + (more than) or - (less than) for a range.",
    order: 60,
  },
  {
    id: "delete",
    long: "-delete",
    group: "actions",
    kind: "boolean",
    danger: "destructive",
    summary: "Permanently delete every matched entry — no confirmation, no undo.",
    detail: "Runs as soon as a match is found. Pair it with -name/-type filters you've already verified, ideally after a dry run without -delete first.",
    // `order` is a single global argv-position key across the whole
    // catalogue (`createFlagCatalogue` sorts all flags together, not
    // per-group) — 100 keeps -delete after every filter above (highest so far: 60).
    order: 100,
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
