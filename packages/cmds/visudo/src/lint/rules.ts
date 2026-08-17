import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { VisudoSpec } from "../spec";

export const RULES: readonly LintRule<VisudoSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
