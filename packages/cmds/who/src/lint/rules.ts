import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { WhoSpec } from "../spec";

export const RULES: readonly LintRule<WhoSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
