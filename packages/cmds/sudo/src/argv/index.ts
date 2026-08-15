import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { SudoSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: SudoSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the sudo invocation: catalogue flags, then the trailing command.
 *
 * `spec.command` is an entire command LINE (e.g. "apt update"), not a
 * single argument — pushing it as one `Arg` would make the render pipeline
 * quote the whole line as a single shell-quoted string (`sudo 'apt
 * update'`), which is wrong. Real usage is `sudo apt update`, with each
 * word its own token. So we split on whitespace and push each resulting
 * word as its own separate `value` Arg — each word still gets quoted
 * individually if it individually needs it (e.g. a word containing `$` or
 * `*`), which is the desired behavior.
 */
export function buildArgv(spec: SudoSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const words = spec.command.trim().split(/\s+/).filter(Boolean);
  for (const word of words) args.push({ text: word, role: "value" });

  return { binary: "sudo", args };
}
