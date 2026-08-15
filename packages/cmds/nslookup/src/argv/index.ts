import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { NslookupSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: NslookupSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the nslookup invocation: catalogue flags first, then the lookup name,
 * then the optional server — matching real nslookup's own
 * `nslookup [-option] name [server]` syntax.
 */
export function buildArgv(spec: NslookupSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const lookupName = spec.lookupName.trim();
  if (lookupName !== "") args.push({ text: lookupName, role: "host" });

  const server = spec.server.trim();
  if (server !== "") args.push({ text: server, role: "value" });

  return { binary: "nslookup", args };
}
