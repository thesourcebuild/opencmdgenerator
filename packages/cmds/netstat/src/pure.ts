/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/df/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { NetstatSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "netstat" as const;

export function flagBool(spec: NetstatSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: NetstatSpec, id: string, value: FlagValue | undefined): NetstatSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
