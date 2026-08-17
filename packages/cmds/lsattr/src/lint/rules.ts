import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { LsattrSpec } from "../spec";

export const RULES: readonly LintRule<LsattrSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
