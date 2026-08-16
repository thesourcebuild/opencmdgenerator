import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { LscpuSpec } from "../spec";

export const RULES: readonly LintRule<LscpuSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
