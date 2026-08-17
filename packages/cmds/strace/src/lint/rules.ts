import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { StraceSpec } from "../spec";

export const RULES: readonly LintRule<StraceSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
