import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { OdSpec } from "../spec";

export const RULES: readonly LintRule<OdSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
