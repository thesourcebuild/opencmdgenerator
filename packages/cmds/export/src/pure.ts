/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/mv/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ExportSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "export" as const;

export function flagBool(spec: ExportSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: ExportSpec, id: string, value: FlagValue | undefined): ExportSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
