import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { RouteSpec } from "../spec";

const MUTATING_ACTIONS = new Set<RouteSpec["action"]>(["add", "delete"]);

const noDestination: LintRule<RouteSpec> = {
  code: "RTE001",
  check(spec) {
    if (!MUTATING_ACTIONS.has(spec.action)) return [];
    if (spec.destination.trim() !== "") return [];
    return [
      {
        code: "RTE001",
        level: "error",
        message: "route needs a destination network or host to add or delete.",
        field: "destination",
      },
    ];
  },
};

/**
 * Unconditional advisory for add/delete — not tied to any specific flag or
 * field value, since there is no way to statically verify a route is the
 * *correct* one before it's applied. Modifying the kernel routing table can
 * cut off connectivity (including, on a remote box, the very connection used
 * to run this command), so this always surfaces once a mutating action is
 * chosen, exactly like git's own unconditional per-action warnings (e.g.
 * GIT011 for `reset --hard`) that key off `field: "action"`/`"mode"` rather
 * than a flag id. Modeled as `level: "warning"` rather than `"destructive"`:
 * this doesn't delete or overwrite data the way `DiagnosticLevel`'s
 * `"destructive"` describes — it's the weaker "can overwrite" caution this
 * app's own `DangerLevel` reserves for flags like netstat's `-p`, just
 * expressed as a lint diagnostic instead of a flag-level badge because
 * `action` isn't a catalogue flag at all.
 */
const changesRoutingTable: LintRule<RouteSpec> = {
  code: "RTE002",
  check(spec) {
    if (!MUTATING_ACTIONS.has(spec.action)) return [];
    const diagnostic: Diagnostic<RouteSpec> = {
      code: "RTE002",
      level: "warning",
      message: "Changing the routing table can break network connectivity.",
      detail: "There is no way for this app to verify this is the correct route before it's applied — double-check the destination and gateway.",
      field: "action",
    };
    return [diagnostic];
  },
};

export const RULES: readonly LintRule<RouteSpec>[] = [noDestination, changesRoutingTable];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
