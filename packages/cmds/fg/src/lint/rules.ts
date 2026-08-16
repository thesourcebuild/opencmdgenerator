import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { FgSpec } from "../spec";

export const RULES: readonly LintRule<FgSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
