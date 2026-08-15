/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/cd/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { MkdirSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "mkdir" as const;

export function flagBool(spec: MkdirSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: MkdirSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: MkdirSpec, id: string, value: FlagValue | undefined): MkdirSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
