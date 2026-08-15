/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/df/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { WcSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "wc" as const;

export function flagBool(spec: WcSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: WcSpec, id: string, value: FlagValue | undefined): WcSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
