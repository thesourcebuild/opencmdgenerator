import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { FingerSpec } from "../spec";

export const RULES: readonly LintRule<FingerSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
