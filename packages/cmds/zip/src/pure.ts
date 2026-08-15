/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/df/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ZipSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "zip" as const;

export function flagBool(spec: ZipSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: ZipSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: ZipSpec, id: string, value: FlagValue | undefined): ZipSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: ZipSpec, patch: Record<string, FlagValue | undefined>): ZipSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
