import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { WSpec } from "../spec";

export const RULES: readonly LintRule<WSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
