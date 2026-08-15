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
 * No -w/--wtmp-only here — real reboot has no wtmp-only mode (unlike
 * halt/poweroff): there is no "just log a reboot without rebooting" variant
 * of this binary, so there is nothing that could downgrade its inherent
 * danger. See `lint/rules.ts`'s `alwaysRebootsTheMachine` (`RBT001`), which
 * — unlike halt's/poweroff's equivalent — fires unconditionally with no
 * exemption.
 */
export const FLAGS: readonly FlagDef[] = [
  // ── options ───────────────────────────────────────────────────────────────
  {
    id: "force",
    short: "-f",
    long: "--force",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "caution",
    summary: "Force an immediate reboot, without going through systemd/logind.",
    detail:
      "Skips asking the service manager to shut things down in order — sessions and services don't get a graceful chance to stop first.",
    order: 10,
  },
  {
    id: "noSync",
    short: "-n",
    long: "--no-sync",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "caution",
    summary: "Skip syncing filesystem buffers to disk before rebooting.",
    detail: "Any data still buffered in memory and not yet written to disk is lost.",
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
