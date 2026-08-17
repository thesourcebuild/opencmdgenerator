import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { ChshSpec } from "../spec";

export const RULES: readonly LintRule<ChshSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
