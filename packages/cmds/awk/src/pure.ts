/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/df/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { AwkSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "awk" as const;

export function flagBool(spec: AwkSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: AwkSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: AwkSpec, id: string, value: FlagValue | undefined): AwkSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
