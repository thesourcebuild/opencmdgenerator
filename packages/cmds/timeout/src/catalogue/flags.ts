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
    id: "signal",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Signal to send on timeout",
    detail: "Signal to send on timeout",
    order: 10,
    arg: {
      placeholder: "TERM",
      separator: " ",
    },
  },
  {
    id: "killAfter",
    short: "-k",
    long: "-k",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Send KILL after additional duration",
    detail: "Send KILL after additional duration",
    order: 20,
    arg: {
      placeholder: "5s",
      separator: " ",
    },
  },
  {
    id: "preserveStatus",
    long: "--preserve-status",
    group: "options",
    kind: "boolean",
    summary: "Preserve command exit status",
    detail: "Preserve command exit status",
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
