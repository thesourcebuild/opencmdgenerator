import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { LspciSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "lspci" as const;

export function flagBool(spec: LspciSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: LspciSpec, id: string, value: FlagValue | undefined): LspciSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
