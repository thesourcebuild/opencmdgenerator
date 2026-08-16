import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { HwinfoSpec } from "../spec";

export const RULES: readonly LintRule<HwinfoSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
