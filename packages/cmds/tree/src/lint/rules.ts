import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { TreeSpec } from "../spec";

export const RULES: readonly LintRule<TreeSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
