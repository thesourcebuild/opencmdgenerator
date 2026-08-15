import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { UfwSpec } from "../spec";

/** Modes that need a port to mean anything. */
const PORT_MODES = new Set<UfwSpec["mode"]>(["allow", "deny", "deleteAllow"]);

const noPort: LintRule<UfwSpec> = {
  code: "UFW001",
  check(spec) {
    if (!PORT_MODES.has(spec.mode)) return [];
    if (spec.port.trim() !== "") return [];
    const diagnostic: Diagnostic<UfwSpec> = {
      code: "UFW001",
      level: "error",
      message: "ufw needs a port to allow, deny, or delete a rule for.",
      field: "port",
    };
    return [diagnostic];
  },
};

export const RULES: readonly LintRule<UfwSpec>[] = [noPort];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
