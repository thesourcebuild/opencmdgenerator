import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { DnfSpec } from "../spec";

export const RULES: readonly LintRule<DnfSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
