import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { RealpathSpec } from "../spec";

export const RULES: readonly LintRule<RealpathSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
