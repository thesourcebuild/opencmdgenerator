import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { DmesgSpec } from "../spec";

export const RULES: readonly LintRule<DmesgSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
