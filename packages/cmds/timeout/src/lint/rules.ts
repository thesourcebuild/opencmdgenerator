import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { TimeoutSpec } from "../spec";

export const RULES: readonly LintRule<TimeoutSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
