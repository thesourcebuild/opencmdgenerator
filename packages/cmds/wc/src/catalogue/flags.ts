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
    id: "lines",
    short: "-l",
    long: "--lines",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print the newline count.",
    detail: "Counts newline characters, not \"visual\" lines — a file with no trailing newline undercounts its last line.",
    order: 10,
  },
  {
    id: "words",
    short: "-w",
    long: "--words",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print the word count.",
    detail: "A word is a maximal run of non-whitespace characters.",
    order: 20,
  },
  {
    id: "bytes",
    short: "-c",
    long: "--bytes",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print the byte count.",
    detail: "Raw byte size — same number ls -l would show for the file.",
    order: 30,
  },
  {
    id: "chars",
    short: "-m",
    long: "--chars",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print the character count.",
    detail: "Counts characters under the current locale's encoding, not raw bytes — differs from -c for multi-byte text.",
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
