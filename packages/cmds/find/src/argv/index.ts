import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { FindSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: FindSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the find invocation: search roots first (real find's own
 * convention — paths before the expression), then the catalogue's filters
 * and -delete, then -exec's hand-rolled three-part grammar.
 *
 * -exec's command text is split on whitespace into separate argv words
 * (real find execs the program directly, with no shell in between, so
 * "chmod 644" must arrive as two argv words, not one) followed by the
 * literal placeholder "{}" and a literal ";" terminator. The terminator is
 * given here as a bare ";" — not a pre-escaped "\;" — so the shared
 * quoting layer wraps it as "';'" itself; embedding the backslash form
 * directly would come out double-escaped once quoting ran over it.
 */
export function buildArgv(spec: FindSpec): Argv {
  const trimmedPaths = spec.paths.map((p) => p.trim()).filter((p) => p !== "");
  const paths = trimmedPaths.length > 0 ? trimmedPaths : ["."];

  const args: Arg[] = paths.map((p): Arg => ({ text: p, role: "path" }));
  args.push(...buildFlagArgs(spec.flags, CATALOGUE));

  const exec = spec.exec.trim();
  if (exec !== "") {
    args.push({ text: "-exec", role: "flag", flagId: "exec" });
    for (const word of exec.split(/\s+/).filter(Boolean)) {
      args.push({ text: word, role: "value", flagId: "exec" });
    }
    args.push({ text: "{}", role: "value", flagId: "exec" });
    args.push({ text: ";", role: "value", flagId: "exec" });
  }

  return { binary: "find", args };
}
