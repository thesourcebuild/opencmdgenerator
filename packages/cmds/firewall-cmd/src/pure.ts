/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/ufw/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { FirewallCmdSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "firewall-cmd" as const;

export function flagBool(spec: FirewallCmdSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: FirewallCmdSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function setFlag(spec: FirewallCmdSpec, id: string, value: FlagValue | undefined): FirewallCmdSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: FirewallCmdSpec, patch: Record<string, FlagValue | undefined>): FirewallCmdSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}
