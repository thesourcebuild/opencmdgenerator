import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { HostSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "host" as const;

export function flagBool(spec: HostSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(spec: HostSpec, id: string, value: FlagValue | undefined): HostSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
