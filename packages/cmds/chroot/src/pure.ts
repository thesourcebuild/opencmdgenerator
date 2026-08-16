import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ChrootSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "chroot" as const;

export function flagBool(spec: ChrootSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function setFlag(
  spec: ChrootSpec,
  id: string,
  value: FlagValue | undefined,
): ChrootSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}
