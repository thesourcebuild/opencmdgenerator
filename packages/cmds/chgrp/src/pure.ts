/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/chown/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ChgrpSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "chgrp" as const;

export function flagBool(spec: ChgrpSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: ChgrpSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: ChgrpSpec, id: string, value: FlagValue | undefined): ChgrpSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
