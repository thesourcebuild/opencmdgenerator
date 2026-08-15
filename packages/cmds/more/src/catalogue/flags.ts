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
    id: "showPrompts",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show helpful prompts, e.g. \"[Press space to continue, 'q' to quit.]\".",
    detail: "Also tells the user about invalid keypresses instead of just ringing the terminal bell.",
    order: 10,
  },
  {
    id: "clearScreen",
    short: "-c",
    long: "-c",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Clear the screen before displaying each page, instead of scrolling.",
    detail: "Repaints from the top of the screen each time rather than scrolling the new page up from the bottom.",
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
