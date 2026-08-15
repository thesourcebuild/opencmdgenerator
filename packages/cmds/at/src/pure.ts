/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/crontab/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { AtSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "at" as const;

// at has zero catalogue flags (see catalogue/flags.ts) — these wrappers are
// kept anyway, mirroring every other command's `pure.ts` shape, in case a
// future catalogue flag is ever added.
export function flagBool(spec: AtSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: AtSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: AtSpec, id: string, value: FlagValue | undefined): AtSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: AtSpec, patch: Record<string, FlagValue | undefined>): AtSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
