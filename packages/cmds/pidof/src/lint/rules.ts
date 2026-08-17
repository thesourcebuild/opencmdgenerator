import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { PidofSpec } from "../spec";

export const RULES: readonly LintRule<PidofSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
