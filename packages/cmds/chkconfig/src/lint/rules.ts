import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { ChkconfigSpec } from "../spec";

export const RULES: readonly LintRule<ChkconfigSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
