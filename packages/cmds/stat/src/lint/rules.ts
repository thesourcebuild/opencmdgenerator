import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { StatSpec } from "../spec";

export const RULES: readonly LintRule<StatSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
