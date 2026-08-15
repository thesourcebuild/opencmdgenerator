/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/killall/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { SudoSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "sudo" as const;

export function flagBool(spec: SudoSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: SudoSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: SudoSpec, id: string, value: FlagValue | undefined): SudoSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: SudoSpec, patch: Record<string, FlagValue | undefined>): SudoSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
