/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/iptables/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { GetenforceSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "getenforce" as const;

// getenforce has zero catalogue flags (see catalogue/flags.ts) — this
// wrapper is kept anyway, mirroring every other command's `pure.ts` shape,
// in case a future catalogue flag is ever added.
export function flagBool(spec: GetenforceSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: GetenforceSpec, id: string, value: FlagValue | undefined): GetenforceSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
