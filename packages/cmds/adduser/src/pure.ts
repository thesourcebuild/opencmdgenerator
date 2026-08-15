/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/useradd/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { AdduserSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "adduser" as const;

export function flagBool(spec: AdduserSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: AdduserSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: AdduserSpec, id: string, value: FlagValue | undefined): AdduserSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: AdduserSpec, patch: Record<string, FlagValue | undefined>): AdduserSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
