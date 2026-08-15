/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/less/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { MoreSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "more" as const;

export function flagBool(spec: MoreSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: MoreSpec, id: string, value: FlagValue | undefined): MoreSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
