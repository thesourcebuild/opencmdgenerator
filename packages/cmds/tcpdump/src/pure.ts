import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { TcpdumpSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "tcpdump" as const;

export function flagBool(spec: TcpdumpSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: TcpdumpSpec,
  id: string,
  value: FlagValue | undefined,
): TcpdumpSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
