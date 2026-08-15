/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/dd/pure` and `@cmdgen/apt/pure`, and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { UfwSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "ufw" as const;

// ufw has zero catalogue flags (see catalogue/flags.ts) — these wrappers are
// kept anyway, mirroring every other command's `pure.ts` shape, in case a
// future catalogue flag is ever added.
export function flagBool(spec: UfwSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: UfwSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: UfwSpec, id: string, value: FlagValue | undefined): UfwSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: UfwSpec, patch: Record<string, FlagValue | undefined>): UfwSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
