/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/iptables/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { SemanageSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "semanage" as const;

// semanage has zero catalogue flags (see catalogue/flags.ts) — every real
// piece of state (objectType, action, target, type) is a spec-level field,
// same shape as @cmdgen/iptables. This wrapper is kept anyway, mirroring
// every other command's `pure.ts` shape, in case a future catalogue flag is
// ever added.
export function flagBool(spec: SemanageSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: SemanageSpec, id: string, value: FlagValue | undefined): SemanageSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
