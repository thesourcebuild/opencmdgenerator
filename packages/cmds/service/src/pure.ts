/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mount/pure` and `@cmdgen/dd/pure`, and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ServiceSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "service" as const;

// service has zero catalogue flags (see catalogue/flags.ts) — these wrappers
// are kept anyway, mirroring every other command's `pure.ts` shape, in case a
// future catalogue flag is ever added.
export function flagBool(spec: ServiceSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: ServiceSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: ServiceSpec, id: string, value: FlagValue | undefined): ServiceSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: ServiceSpec, patch: Record<string, FlagValue | undefined>): ServiceSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
