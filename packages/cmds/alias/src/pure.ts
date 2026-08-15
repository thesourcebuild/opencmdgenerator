/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/export/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { AliasSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "alias" as const;

export function flagBool(spec: AliasSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: AliasSpec, id: string, value: FlagValue | undefined): AliasSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
