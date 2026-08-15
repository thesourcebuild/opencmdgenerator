/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/less/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { EmacsSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "emacs" as const;

export function flagBool(spec: EmacsSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: EmacsSpec, id: string, value: FlagValue | undefined): EmacsSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
