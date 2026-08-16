import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { TimedatectlSpec } from "../spec";

export const RULES: readonly LintRule<TimedatectlSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
