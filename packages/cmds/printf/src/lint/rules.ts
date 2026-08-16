import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { PrintfSpec } from "../spec";

export const RULES: readonly LintRule<PrintfSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
