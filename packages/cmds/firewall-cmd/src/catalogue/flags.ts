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

/**
 * Just one real catalogue flag — every other piece of firewall-cmd's
 * surface (which option gets sent, and its argument) is the spec-level
 * `action`/`zone`/`port`/`service` combination in `argv/index.ts`, the same
 * split `@cmdgen/ufw` uses for `mode`/`port`/`protocol`.
 */
export const FLAGS: readonly FlagDef[] = [
  {
    id: "permanent",
    long: "--permanent",
    group: "options",
    kind: "boolean",
    summary: "Make the change persist across reloads and reboots.",
    detail:
      "Without this, add-port/remove-port/add-service/remove-service changes are runtime-only — the next --reload or reboot reverts to the permanent configuration, silently undoing them.",
    order: 10,
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
