import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { WatchSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "watch" as const;

export function flagBool(spec: WatchSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: WatchSpec, id: string, value: FlagValue | undefined): WatchSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
