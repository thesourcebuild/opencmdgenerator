import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { IdSpec } from "../spec";

export const RULES: readonly LintRule<IdSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
