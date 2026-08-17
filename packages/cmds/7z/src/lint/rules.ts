import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { SevenzSpec } from "../spec";

export const RULES: readonly LintRule<SevenzSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
