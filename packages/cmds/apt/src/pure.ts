/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/zip/pure` and `@cmdgen/df/pure`, and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { AptSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "apt" as const;

export function flagBool(spec: AptSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: AptSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: AptSpec, id: string, value: FlagValue | undefined): AptSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: AptSpec, patch: Record<string, FlagValue | undefined>): AptSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
