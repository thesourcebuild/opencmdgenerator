/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/cmp/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { CommSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "comm" as const;

export function flagBool(spec: CommSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: CommSpec, id: string, value: FlagValue | undefined): CommSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
