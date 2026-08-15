/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/df/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { SedSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "sed" as const;

export function flagBool(spec: SedSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: SedSpec, id: string, value: FlagValue | undefined): SedSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

/** Every non-blank expression, `script` first, in the order sed would apply them. */
export function expressions(spec: SedSpec): string[] {
  return [spec.script, ...spec.extraExpressions].map((e) => e.trim()).filter((e) => e !== "");
}
