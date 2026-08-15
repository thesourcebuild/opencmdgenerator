/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mount/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { IptablesSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "iptables" as const;

// iptables has zero catalogue flags (see catalogue/flags.ts) — these
// wrappers are kept anyway, mirroring every other command's `pure.ts` shape,
// in case a future catalogue flag is ever added.
export function flagBool(spec: IptablesSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: IptablesSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: IptablesSpec, id: string, value: FlagValue | undefined): IptablesSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: IptablesSpec, patch: Record<string, FlagValue | undefined>): IptablesSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
