import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { LshwSpec } from "../spec";

export const RULES: readonly LintRule<LshwSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
