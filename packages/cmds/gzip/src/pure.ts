/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/zip/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { GzipSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "gzip" as const;

export function flagBool(spec: GzipSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: GzipSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: GzipSpec, id: string, value: FlagValue | undefined): GzipSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: GzipSpec, patch: Record<string, FlagValue | undefined>): GzipSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
