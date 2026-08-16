import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { TacSpec } from "../spec";

export const RULES: readonly LintRule<TacSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
