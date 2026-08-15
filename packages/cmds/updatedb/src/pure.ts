/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mount/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { UpdatedbSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "updatedb" as const;

export function flagString(spec: UpdatedbSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: UpdatedbSpec, id: string, value: FlagValue | undefined): UpdatedbSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
