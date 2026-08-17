import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { FirewalldSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "firewalld" as const;

export function flagBool(spec: FirewalldSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: FirewalldSpec,
  id: string,
  value: FlagValue | undefined,
): FirewalldSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
