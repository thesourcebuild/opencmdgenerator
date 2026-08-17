import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { FuserSpec } from "../spec";

export const RULES: readonly LintRule<FuserSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
