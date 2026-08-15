/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/killall/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { PasswdSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "passwd" as const;

export function flagBool(spec: PasswdSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: PasswdSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: PasswdSpec, id: string, value: FlagValue | undefined): PasswdSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: PasswdSpec, patch: Record<string, FlagValue | undefined>): PasswdSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
