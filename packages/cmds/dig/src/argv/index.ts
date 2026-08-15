import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { DigSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: DigSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the dig invocation: catalogue flags first (matching every other
 * command's convention in this app — see `@cmdgen/curl`'s own note on this),
 * then the `@server` positional (dig doesn't care where it sits relative to
 * other tokens), then the lookup name, then the record type as a final bare
 * positional.
 */
export function buildArgv(spec: DigSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const server = spec.server.trim();
  if (server !== "") args.push({ text: `@${server}`, role: "value" });

  const lookupName = spec.lookupName.trim();
  if (lookupName !== "") args.push({ text: lookupName, role: "host" });

  if (spec.type !== "") args.push({ text: spec.type, role: "value" });

  return { binary: "dig", args };
}
