/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mv/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { EchoSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "echo" as const;

export function flagBool(spec: EchoSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagEnum<T extends string>(spec: EchoSpec, id: string, allowed: readonly T[]): T | undefined {
  return generic.flagEnum(spec.flags, id, allowed);
}

export function setFlag(spec: EchoSpec, id: string, value: FlagValue | undefined): EchoSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
