import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { PasswdSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: PasswdSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the passwd invocation: catalogue flags, then the username (if any). */
export function buildArgv(spec: PasswdSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const username = spec.username.trim();
  if (username !== "") args.push({ text: username, role: "value" });

  return { binary: "passwd", args };
}
