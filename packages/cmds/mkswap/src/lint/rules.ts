import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { MkswapSpec } from "../spec";

export const RULES: readonly LintRule<MkswapSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
