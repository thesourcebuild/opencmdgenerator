import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { IostatSpec } from "../spec";

export const RULES: readonly LintRule<IostatSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
