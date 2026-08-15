/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/chmod/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { TopSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "top" as const;

export function flagBool(spec: TopSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: TopSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: TopSpec, id: string, value: FlagValue | undefined): TopSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: TopSpec, patch: Record<string, FlagValue | undefined>): TopSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
