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
    id: "outputDocument",
    // `long` is set to the short spelling because the render engine always
    // emits a text-kind flag's `long` field verbatim, ignoring `preferShort`
    // (see `renderFlag` in `@cmdgen/engine`'s `argv/index.ts`) — the same
    // reason `@cmdgen/killall`'s `signal` flag and `@cmdgen/touch`'s `stamp`/
    // `@cmdgen/top`'s `pid` flags set `long` to their short spelling instead
    // of a separate long name. Real wget also accepts `--output-document`;
    // this catalogue models only the one spelling that actually renders,
    // space-separated (not `=`), to match the "-O page.html" preset output.
    short: "-O",
    long: "-O",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "page.html", separator: " " },
    summary: "Save the downloaded file under this name instead of the URL's own filename.",
    detail: "Useful when the URL doesn't end in a sensible filename, or you want a custom name.",
    order: 10,
  },
  {
    id: "continueDownload",
    short: "-c",
    long: "-c",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Resume a partially-downloaded file instead of starting over.",
    detail: "Requires the existing partial file to still be present in the current directory.",
    order: 20,
  },
  {
    id: "quiet",
    short: "-q",
    long: "-q",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Suppress wget's normal progress output.",
    detail: "Only errors are still printed.",
    order: 30,
  },
  {
    id: "recursive",
    short: "-r",
    long: "-r",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Follow links and download an entire site recursively.",
    detail: "Can download far more than intended without limits — combine with --no-parent or a depth limit in practice.",
    order: 40,
  },
  {
    id: "noParent",
    long: "--no-parent",
    group: "options",
    kind: "boolean",
    conflictsWith: [],
    summary: "When recursing, never ascend to the parent directory.",
    detail: "Only has an effect together with -r; keeps a recursive download confined to the given path and below.",
    order: 50,
  },
  {
    id: "directoryPrefix",
    // Same short-form-render trick as `outputDocument` above.
    short: "-P",
    long: "-P",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "downloads/", separator: " " },
    summary: "Save all downloaded files under this directory instead of the current one.",
    detail: "The directory is created if it doesn't already exist.",
    order: 60,
  },
  {
    id: "userAgent",
    long: "--user-agent",
    group: "options",
    kind: "text",
    arg: { placeholder: "Mozilla/5.0", separator: "=" },
    summary: "Send this User-Agent header instead of wget's default.",
    detail: "Some servers block or alter responses based on wget's default User-Agent string.",
    order: 70,
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
