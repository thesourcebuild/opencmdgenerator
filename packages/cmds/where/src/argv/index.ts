import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { WhereSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: WhereSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the where invocation: catalogue flags, then every non-empty
 * pattern, in order.
 *
 * The binary name itself depends on platform — see spec.ts's `WherePlatform`
 * doc comment for why: PowerShell's built-in `where -> Where-Object` alias
 * silently shadows the real tool, so the PowerShell target must render the
 * explicit `where.exe` to bypass it. cmd.exe has no such alias, so it stays
 * plain `where` (matching what a user would actually type there).
 */
export function buildArgv(spec: WhereSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  for (const raw of spec.patterns) {
    const pattern = raw.trim();
    if (pattern !== "") args.push({ text: pattern, role: "value" });
  }

  return { binary: spec.platform === "powershell" ? "where.exe" : "where", args };
}
