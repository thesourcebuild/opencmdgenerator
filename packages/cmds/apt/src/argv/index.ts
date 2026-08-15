import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { AptSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Actions real apt accepts one or more package names for. */
const PACKAGE_ACTIONS = new Set<AptSpec["action"]>(["install", "remove", "search"]);

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: AptSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the apt invocation: the action as a single bare leading token (not a
 * `-flag` — same shape as `@cmdgen/cal`'s bare month/year), then catalogue
 * flags, then — only for install/remove/search — every non-empty package
 * name. update/upgrade/list never get package names pushed, even if the
 * field has entries: real apt would error or ignore them, so the simplest
 * and safest behavior here is to never push them for those three actions.
 */
export function buildArgv(spec: AptSpec): Argv {
  const args: Arg[] = [{ text: spec.action, role: "value" }];
  args.push(...buildFlagArgs(spec.flags, CATALOGUE));

  if (PACKAGE_ACTIONS.has(spec.action)) {
    for (const pkg of spec.packages) {
      const trimmed = pkg.trim();
      if (trimmed !== "") args.push({ text: trimmed, role: "value" });
    }
  }

  return { binary: "apt", args };
}
