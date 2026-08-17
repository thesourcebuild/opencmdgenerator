import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { AptCacheSpec } from "../spec";

export const RULES: readonly LintRule<AptCacheSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
