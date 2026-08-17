import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { InsmodSpec } from "../spec";

export const RULES: readonly LintRule<InsmodSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
