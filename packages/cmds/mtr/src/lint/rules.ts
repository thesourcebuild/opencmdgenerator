import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { MtrSpec } from "../spec";

export const RULES: readonly LintRule<MtrSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
