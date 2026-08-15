/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mv/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ClearSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "clear" as const;

export function flagBool(spec: ClearSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: ClearSpec, id: string, value: FlagValue | undefined): ClearSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
