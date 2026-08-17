import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { SwapoffSpec } from "../spec";

export const RULES: readonly LintRule<SwapoffSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
