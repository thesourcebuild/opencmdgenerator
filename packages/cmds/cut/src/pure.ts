/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/df/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { CutSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "cut" as const;

export function flagBool(spec: CutSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: CutSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: CutSpec, id: string, value: FlagValue | undefined): CutSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
