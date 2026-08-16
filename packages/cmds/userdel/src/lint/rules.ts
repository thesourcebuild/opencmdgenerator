import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { UserdelSpec } from "../spec";

export const RULES: readonly LintRule<UserdelSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
