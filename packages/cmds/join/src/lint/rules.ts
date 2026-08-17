import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { JoinSpec } from "../spec";

export const RULES: readonly LintRule<JoinSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
