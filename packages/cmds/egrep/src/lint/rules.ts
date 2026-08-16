import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { EgrepSpec } from "../spec";

export const RULES: readonly LintRule<EgrepSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
