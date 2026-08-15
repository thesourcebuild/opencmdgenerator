import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { AptGetSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Actions real apt-get accepts one or more package names for. */
const PACKAGE_ACTIONS = new Set<AptGetSpec["action"]>(["install", "remove", "purge"]);

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: AptGetSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the apt-get invocation: the action as a single bare leading token
 * (not a `-flag` — same shape as `@cmdgen/apt`'s action), then catalogue
 * flags, then — only for install/remove/purge — every non-empty package
 * name. update/upgrade/autoremove never get package names pushed, even if
 * the field has entries: real apt-get takes none for those three, so the
 * simplest and safest behavior here is to never push them.
 */
export function buildArgv(spec: AptGetSpec): Argv {
  const args: Arg[] = [{ text: spec.action, role: "value" }];
  args.push(...buildFlagArgs(spec.flags, CATALOGUE));

  if (PACKAGE_ACTIONS.has(spec.action)) {
    for (const pkg of spec.packages) {
      const trimmed = pkg.trim();
      if (trimmed !== "") args.push({ text: trimmed, role: "value" });
    }
  }

  return { binary: "apt-get", args };
}
