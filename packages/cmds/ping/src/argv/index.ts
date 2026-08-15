import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { PingSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: PingSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the ping invocation: catalogue flags, then the host. */
export function buildArgv(spec: PingSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const host = spec.host.trim();
  if (host !== "") args.push({ text: host, role: "host" });

  return { binary: "ping", args };
}
