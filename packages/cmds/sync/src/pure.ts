import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { SyncSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "sync" as const;

export function flagBool(spec: SyncSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: SyncSpec, id: string, value: FlagValue | undefined): SyncSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
