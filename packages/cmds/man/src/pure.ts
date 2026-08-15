/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/killall/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ManSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "man" as const;

export function flagBool(spec: ManSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: ManSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: ManSpec, id: string, value: FlagValue | undefined): ManSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: ManSpec, patch: Record<string, FlagValue | undefined>): ManSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
