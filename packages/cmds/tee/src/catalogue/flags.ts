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
    id: "append",
    short: "-a",
    long: "--append",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Append to each target file instead of overwriting it.",
    detail: "Without this, tee truncates every listed file before writing — anything already there is gone.",
    order: 10,
  },
  {
    id: "ignoreInterrupts",
    short: "-i",
    long: "--ignore-interrupts",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Ignore interrupt signals (SIGINT).",
    detail: "Lets tee keep writing even if the rest of the pipeline is interrupted (e.g. by Ctrl+C upstream).",
    order: 20,
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
