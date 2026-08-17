import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { NlSpec } from "../spec";

export const RULES: readonly LintRule<NlSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
