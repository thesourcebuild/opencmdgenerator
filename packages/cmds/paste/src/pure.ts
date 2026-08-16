import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { PasteSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "paste" as const;

export function flagBool(spec: PasteSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: PasteSpec, id: string, value: FlagValue | undefined): PasteSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
