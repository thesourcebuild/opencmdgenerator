import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { TrSpec } from "../spec";

export const RULES: readonly LintRule<TrSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
