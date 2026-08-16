import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { JobsSpec } from "../spec";

export const RULES: readonly LintRule<JobsSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
