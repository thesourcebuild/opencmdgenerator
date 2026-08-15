/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/iptables/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { SetenforceSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "setenforce" as const;

// setenforce has zero catalogue flags (see catalogue/flags.ts) — its one
// real field, `mode`, is a spec-level enum, same shape as iptables' `action`.
// This wrapper is kept anyway, mirroring every other command's `pure.ts`
// shape, in case a future catalogue flag is ever added.
export function flagBool(spec: SetenforceSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: SetenforceSpec, id: string, value: FlagValue | undefined): SetenforceSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
