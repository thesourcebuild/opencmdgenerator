import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { AwkSpec } from "../spec";

const noProgram: LintRule<AwkSpec> = {
  code: "AWK001",
  check(spec) {
    if (spec.program.trim() !== "") return [];
    return [{ code: "AWK001", level: "error", message: "No awk program to run.", field: "program" }];
  },
};

/**
 * Everything else is either always valid (any combination of -F, --posix, and
 * any number of -v assignments is legal) or entirely up to the awk program's
 * own text, which this generator deliberately does not parse — see spec.ts's
 * scope note and `describeSpec`'s caveat about the program potentially
 * writing files itself.
 */
export const RULES: readonly LintRule<AwkSpec>[] = [noProgram];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
