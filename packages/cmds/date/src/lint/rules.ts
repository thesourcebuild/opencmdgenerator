import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { DateSpec } from "../spec";

export const RULES: readonly LintRule<DateSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
