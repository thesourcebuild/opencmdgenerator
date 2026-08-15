/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/service/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { CrontabSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "crontab" as const;

// crontab has zero catalogue flags (see catalogue/flags.ts) — these wrappers
// are kept anyway, mirroring every other command's `pure.ts` shape, in case a
// future catalogue flag is ever added.
export function flagBool(spec: CrontabSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: CrontabSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: CrontabSpec, id: string, value: FlagValue | undefined): CrontabSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: CrontabSpec, patch: Record<string, FlagValue | undefined>): CrontabSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
