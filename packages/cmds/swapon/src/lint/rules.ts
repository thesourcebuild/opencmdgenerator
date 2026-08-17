import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { SwaponSpec } from "../spec";

export const RULES: readonly LintRule<SwaponSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
