/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/useradd/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { SuSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "su" as const;

export function flagBool(spec: SuSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: SuSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: SuSpec, id: string, value: FlagValue | undefined): SuSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: SuSpec, patch: Record<string, FlagValue | undefined>): SuSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}

/** su's real positional default — an empty username means "switch to root." */
export function effectiveTarget(spec: SuSpec): string {
  const username = spec.username.trim();
  return username !== "" ? username : "root";
}
