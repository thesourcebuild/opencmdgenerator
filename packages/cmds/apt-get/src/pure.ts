/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/apt/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { AptGetSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "apt-get" as const;

export function flagBool(spec: AptGetSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: AptGetSpec, id: string, value: FlagValue | undefined): AptGetSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
