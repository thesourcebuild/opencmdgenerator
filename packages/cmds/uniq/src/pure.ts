/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/df/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { UniqSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "uniq" as const;

export function flagBool(spec: UniqSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagNumber(spec: UniqSpec, id: string): number | undefined {
  return generic.flagNumber(spec.flags, id);
}

export function setFlag(spec: UniqSpec, id: string, value: FlagValue | undefined): UniqSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
