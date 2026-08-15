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
    id: "force",
    short: "-f",
    long: "--force",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "caution",
    summary: "Force an unmount, even if the filesystem is still busy or marked in use.",
    detail:
      "Can cause data loss for whatever process still has files open on it — use only after a normal umount has already failed and you're sure it's safe.",
    order: 10,
  },
  {
    id: "lazy",
    short: "-l",
    long: "--lazy",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Detach the filesystem from the tree now, cleaning it up once it stops being busy.",
    detail: "Returns immediately; the actual detachment happens in the background as soon as nothing is using it anymore.",
    order: 20,
  },
  {
    id: "all",
    short: "-a",
    long: "--all",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Unmount every filesystem currently listed in the mount table.",
    detail: "Ignores the target field entirely — with --all, umount unmounts everything it can, filtered only by --types if that's also given.",
    order: 30,
  },
  {
    id: "types",
    // Text/number/path-kind flags always render via `long` (the shared
    // engine's `renderFlag` doesn't consult `preferShort` for these kinds,
    // only for booleans/enums — same reason `@cmdgen/mount`'s own "-t" sets
    // `long: "-t"` too, sacrificing the separate "--types" spelling).
    long: "-t",
    group: "options",
    kind: "text",
    arg: { placeholder: "nfs,cifs", separator: " " },
    summary: "Restrict the operation to filesystems of the given type(s).",
    detail: "Comma-separated list. Only meaningful together with --all — targeting a single device already implies its own type from the mount table.",
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
