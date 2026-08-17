import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { DisownSpec } from "../spec";

export const RULES: readonly LintRule<DisownSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
