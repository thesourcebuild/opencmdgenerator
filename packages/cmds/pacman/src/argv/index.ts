import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { PacmanOperation, PacmanSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/**
 * Lookup from operation to the exact text of the bare leading token —
 * unusual in that the "operation" IS the flag spelling itself (-S, -R, -Ss,
 * -Syu), not a separate word alongside a flag. Mirrors `@cmdgen/clear`'s
 * `BINARY` record shape, but here the lookup produces the bare leading token
 * text pushed onto argv, not the binary name.
 */
export const OPERATION_TOKEN: Record<PacmanOperation, string> = {
  sync: "-S",
  remove: "-R",
  searchSync: "-Ss",
  refreshUpgrade: "-Syu",
};

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: PacmanSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the pacman invocation: the operation's bare token first, then
 * catalogue flags, then — only for sync/remove/searchSync — every package
 * name. refreshUpgrade (real `pacman -Syu`) never takes package names, so
 * `packages` is ignored entirely for it.
 */
export function buildArgv(spec: PacmanSpec): Argv {
  const args: Arg[] = [{ text: OPERATION_TOKEN[spec.operation], role: "value" }];

  args.push(...buildFlagArgs(spec.flags, CATALOGUE));

  if (spec.operation === "sync" || spec.operation === "remove" || spec.operation === "searchSync") {
    for (const pkg of spec.packages) {
      const trimmed = pkg.trim();
      if (trimmed !== "") args.push({ text: trimmed, role: "value" });
    }
  }

  return { binary: "pacman", args };
}
