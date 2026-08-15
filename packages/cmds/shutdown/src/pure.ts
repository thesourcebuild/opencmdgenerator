/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/halt/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ShutdownSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "shutdown" as const;

export function flagBool(spec: ShutdownSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: ShutdownSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: ShutdownSpec, id: string, value: FlagValue | undefined): ShutdownSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: ShutdownSpec, patch: Record<string, FlagValue | undefined>): ShutdownSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
