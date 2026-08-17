import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { BasenameSpec } from "../spec";

export const RULES: readonly LintRule<BasenameSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
