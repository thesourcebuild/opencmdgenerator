import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { LastlogSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "lastlog" as const;

export function flagBool(spec: LastlogSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: LastlogSpec,
  id: string,
  value: FlagValue | undefined,
): LastlogSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
