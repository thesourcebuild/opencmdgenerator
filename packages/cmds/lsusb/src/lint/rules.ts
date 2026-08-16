import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { LsusbSpec } from "../spec";

export const RULES: readonly LintRule<LsusbSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
