import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { LsmodSpec } from "../spec";

export const RULES: readonly LintRule<LsmodSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
