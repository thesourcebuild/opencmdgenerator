import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { DirnameSpec } from "../spec";

export const RULES: readonly LintRule<DirnameSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
