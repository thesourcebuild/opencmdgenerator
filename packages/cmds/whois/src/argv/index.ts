import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { WhoisSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: WhoisSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the whois invocation: catalogue flags, then the domain (or address). */
export function buildArgv(spec: WhoisSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const domain = spec.domain.trim();
  if (domain !== "") args.push({ text: domain, role: "host" });

  return { binary: "whois", args };
}
