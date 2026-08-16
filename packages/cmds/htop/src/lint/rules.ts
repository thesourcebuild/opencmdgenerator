import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { HtopSpec } from "../spec";

export const RULES: readonly LintRule<HtopSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
