/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/gzip/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { GunzipSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "gunzip" as const;

export function flagBool(spec: GunzipSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: GunzipSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: GunzipSpec, id: string, value: FlagValue | undefined): GunzipSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: GunzipSpec, patch: Record<string, FlagValue | undefined>): GunzipSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
