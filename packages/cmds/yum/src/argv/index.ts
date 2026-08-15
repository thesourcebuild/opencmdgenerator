import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { YumSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: YumSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the yum invocation: the action as a bare leading token, then
 * catalogue flags, then every package name — same bare-token shape as
 * `@cmdgen/cal`'s month/year. Unlike apt's `update`, yum's `update` can
 * legitimately take package names too, so packages are pushed for all four
 * actions; the only special case is that an empty package list is valid for
 * `update` (handled by lint, not here).
 */
export function buildArgv(spec: YumSpec): Argv {
  const args: Arg[] = [{ text: spec.action, role: "value" }];

  args.push(...buildFlagArgs(spec.flags, CATALOGUE));

  for (const pkg of spec.packages) {
    const trimmed = pkg.trim();
    if (trimmed !== "") args.push({ text: trimmed, role: "value" });
  }

  return { binary: "yum", args };
}
