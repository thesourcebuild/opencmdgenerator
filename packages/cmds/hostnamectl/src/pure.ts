import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { HostnamectlSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "hostnamectl" as const;

export function flagBool(spec: HostnamectlSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: HostnamectlSpec,
  id: string,
  value: FlagValue | undefined,
): HostnamectlSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
