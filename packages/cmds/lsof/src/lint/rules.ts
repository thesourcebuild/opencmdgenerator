import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { LsofSpec } from "../spec";

export const RULES: readonly LintRule<LsofSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
