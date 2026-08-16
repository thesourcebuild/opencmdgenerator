import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { GroupdelSpec } from "../spec";

export const RULES: readonly LintRule<GroupdelSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
