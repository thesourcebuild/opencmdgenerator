import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { FgrepSpec } from "../spec";

export const RULES: readonly LintRule<FgrepSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
