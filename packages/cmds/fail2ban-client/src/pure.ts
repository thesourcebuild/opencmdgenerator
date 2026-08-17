import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { Fail2banClientSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "fail2ban-client" as const;

export function flagBool(spec: Fail2banClientSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: Fail2banClientSpec,
  id: string,
  value: FlagValue | undefined,
): Fail2banClientSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
