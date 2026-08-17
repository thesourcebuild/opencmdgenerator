import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { UnxzSpec } from "../spec";

export const RULES: readonly LintRule<UnxzSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
