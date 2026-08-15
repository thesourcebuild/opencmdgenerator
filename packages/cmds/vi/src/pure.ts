/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/less/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ViSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "vi" as const;

export function flagBool(spec: ViSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: ViSpec, id: string, value: FlagValue | undefined): ViSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
