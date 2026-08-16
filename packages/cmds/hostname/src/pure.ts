import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { HostnameSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "hostname" as const;

export function flagBool(spec: HostnameSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: HostnameSpec,
  id: string,
  value: FlagValue | undefined,
): HostnameSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
