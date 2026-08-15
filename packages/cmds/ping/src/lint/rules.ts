import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { PingSpec } from "../spec";
import { flagString } from "../pure";

const emptyHost: LintRule<PingSpec> = {
  code: "PNG001",
  check(spec) {
    if (spec.host.trim() !== "") return [];
    return [
      {
        code: "PNG001",
        level: "error",
        message: "ping needs a host to ping.",
        field: "host",
      },
    ];
  },
};

/**
 * A usability note, not an error: real ping without -c genuinely does run
 * forever, which is entirely legal (that's the default, interactive
 * behavior man ping documents) — worth surfacing so a generated command
 * doesn't look "stuck" to someone who forgot they'd need Ctrl-C to stop it.
 */
const noCountRunsForever: LintRule<PingSpec> = {
  code: "PNG002",
  check(spec) {
    if (flagString(spec, "count")) return [];
    const diagnostic: Diagnostic<PingSpec> = {
      code: "PNG002",
      level: "info",
      message: "Without -c, ping runs forever until manually interrupted (Ctrl-C).",
      flagIds: ["count"],
    };
    return [diagnostic];
  },
};

export const RULES: readonly LintRule<PingSpec>[] = [emptyHost, noCountRunsForever];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
