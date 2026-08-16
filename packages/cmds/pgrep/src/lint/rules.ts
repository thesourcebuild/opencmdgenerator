import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { PgrepSpec } from "../spec";

export const RULES: readonly LintRule<PgrepSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
