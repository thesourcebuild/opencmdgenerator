import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { GroupsSpec } from "../spec";

export const RULES: readonly LintRule<GroupsSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
