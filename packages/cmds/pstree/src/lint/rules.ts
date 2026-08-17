import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { PstreeSpec } from "../spec";

export const RULES: readonly LintRule<PstreeSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
