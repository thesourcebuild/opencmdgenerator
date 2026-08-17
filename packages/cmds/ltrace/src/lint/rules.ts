import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { LtraceSpec } from "../spec";

export const RULES: readonly LintRule<LtraceSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
