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
    id: "noWindowSystem",
    short: "-nw",
    long: "--no-window-system",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Run in the terminal instead of opening a graphical window.",
    detail: "Useful over SSH or in any environment with no display available.",
    order: 10,
  },
  {
    id: "quickStart",
    short: "-Q",
    long: "-Q",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Skip loading the init file and default settings.",
    detail: "Starts a plain, unconfigured Emacs — useful for a quick edit unaffected by personal configuration, or to rule out an init-file problem.",
    order: 20,
  },
  {
    id: "daemon",
    long: "--daemon",
    group: "options",
    kind: "boolean",
    summary: "Start an Emacs server in the background instead of opening a window.",
    detail: "Connect to it afterward with emacsclient. No frame is ever shown by this invocation itself.",
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
